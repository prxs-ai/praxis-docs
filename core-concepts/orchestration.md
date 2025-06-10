# Orchestration with Ray Workflows

The agent runtime executes tasks using **Ray Workflows**. Each workflow is defined in YAML (see [Workflow DSL](workflows.md)) and turned into a directed acyclic graph where every step invokes a tool in its own Ray task.

## Loading Workflows

Workflow YAML files are discovered at startup using the plugin system. The helper below finds all `*.yaml` files relative to the agent package `workflows/` folder:

```python

    10	def determine_workflow_path(workflows_dir="workflows") -> str:
    11	    # always exists
    12	    candidate = get_entrypoint(EntrypointGroup.AGENT_ENTRYPOINT)
    13	    pkg_path, _ = candidate.value.split(":", 1)
    14	
    15	    # the workflows should be in the root of the package
    16	    package_name = pkg_path.split(".")[0]
    17	
    18	    # Get the package location on filesystem
    19	    package = __import__(package_name)
    20	    package_dir = str(package.__path__[0])
    21	
    22	    return os.path.join(package_dir, workflows_dir)
    23	
    24	
    25	def get_workflow_files() -> list[str]:
    26	    workflow_dir = determine_workflow_path()
    27	    workflow_files = []
    28	
    29	    # Recursively find all yaml/yml files
    30	    for root, _, files in os.walk(workflow_dir):
    31	        for file in files:
    32	            if file.endswith((".yaml", ".yml")):
    33	                workflow_files.append(os.path.join(root, file))
```

## Running Steps

`DAGRunner` converts each `WorkflowStep` into a remote function. Tools are loaded via entry points and Ray creates an isolated runtime environment that can install missing dependencies:

```python

    61	    def create_step(self, step: WorkflowStep):
    62	        """Create a remote function for a step."""
    63	        runtime_env = RuntimeEnv(pip=[step.tool.render_pip_dependency()], env_vars=step.env_vars)
    64	
    65	        @ray.workflow.options(checkpoint=True)
    66	        @ray.remote(
    67	            runtime_env=runtime_env,
    68	            max_retries=self.config.WORKFLOW_STEP_MAX_RETRIES,
    69	            retry_exceptions=True,
    70	        )
    71	        def get_tool_entrypoint_wrapper(*args, **kwargs):
    72	            entry_points = get_entry_points(EntrypointGroup.TOOL_ENTRYPOINT)
    73	            try:
    74	                tool = entry_points[step.tool.package_name].load()
    75	            except KeyError as exc:
    76	                raise ValueError(f"Tool {step.tool.package_name} not found in entry points") from exc
    77	            return workflow.continuation(
    78	                tool.options(runtime_env=RuntimeEnv(env_vars=step.env_vars)).bind(*args, **kwargs)
    79	            )
    80	
    81	        return get_tool_entrypoint_wrapper, step.args
```

The `run` method then executes steps in order and returns the final result. It supports both synchronous and asynchronous execution modes:

```python

    83	    async def run(self, dag_spec: Workflow, context: Any = None, async_mode=False) -> Any:
    84	        """Run the DAG using Ray Workflows."""
    85	        # Create remote functions for each step
    86	        steps = {}
    87	
    88	        for step in dag_spec.steps:
    89	            steps[step.task_id] = self.create_step(step)
    90	        last_task_id = step.task_id
    91	
    92	        @ray.remote
    93	        def workflow_executor(request_id: str) -> Any:
    94	            step_results = {}
    95	
    96	            # Execute steps in order, handling dependencies
    97	            for task_id, (task, task_args) in sorted(steps.items()):
    98	                # Execute step with dependencies
    99	                result = task.bind(**task_args)
   100	
   101	                # Store result for dependencies
   102	                step_results[task_id] = result
   103	
   104	                # If this is the last step, return its result
   105	                if task_id == last_task_id:
   106	                    return workflow.continuation(result)
   107	
   108	            # Return the last result as a fallback
   109	            last_result = list(step_results.values())[-1] if step_results else None
   110	            return workflow.continuation(last_result)
   111	
   112	        # Start the workflow with options for durability
   113	        func = workflow.run
   114	        if async_mode:
   115	            func = workflow.run_async
   116	
   117	        return func(
   118	            workflow_executor.bind(generate_request_id.bind()),
   119	            workflow_id=dag_spec.id,  # Unique ID for each workflow
   120	            metadata={"dag_spec": dag_spec.model_dump()},  # Store metadata for debugging
```

## Bootstrapping the Runner

When the agent service starts, the workflow runner daemon is launched and any static workflows are executed in the background. This happens during the FastAPI lifespan:

```python

    13	def bootstrap_main(agent_cls: type[abc.AbstractAgent]) -> type[Deployment]:
    14	    """Bootstrap a main agent with the necessary components to be able to run as a Ray Serve deployment."""
    15	    from ray import serve
    16	
    17	    runner: abc.AbstractWorkflowRunner = workflow_builder()
    18	    card: abc.AbstractAgentCard = card_builder()
    19	    p2p: abc.AbstractAgentP2PManager = p2p_builder()
    20	
    21	    @asynccontextmanager
    22	    async def lifespan(app: FastAPI):
    23	        # launch some tasks on app start
    24	        runner.start_daemon()
    25	        runner.run_background_workflows()
    26	
    27	        await p2p.start()
    28	        yield
    29	        runner.stop_daemon()
    30	
    31	        await p2p.shutdown()
```

## Distributed Handoff

Although workflows run on a Ray cluster, the overall architecture is something called a **decentralized cooperation**. Agents can hand off tasks to peers over libp2p, allowing an open‑ended swarm of agents to collaborate without a central coordinator.
