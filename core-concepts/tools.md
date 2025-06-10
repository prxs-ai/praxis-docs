# Tools

Tools are standalone Python packages that expose an entry point so the agent runtime can discover and execute them. Each workflow step references a tool by name and version. When the workflow runs, Ray installs the package on demand in an isolated environment.

## Implementing a Tool Package

A tool package defines an entry point in its `pyproject.toml` under `tool.entrypoint`. The callable should return a Ray remote function that implements the tool logic. Because tools are regular Python packages they can be published and installed with `pip`.

```toml
[project.entry-points."tool.entrypoint"]
return-answer-tool = "example_pkg.tool:return_answer"
```

## Dynamic Installation

`DAGRunner.create_step()` configures a Ray task with a runtime environment that installs the tool if it is not already available. The tool is loaded via entry points before execution.

```python
    61  def create_step(self, step: WorkflowStep):
    62      """Create a remote function for a step."""
    63      runtime_env = RuntimeEnv(pip=[step.tool.render_pip_dependency()], env_vars=step.env_vars)
    64
    65      @ray.workflow.options(checkpoint=True)
    66      @ray.remote(
    67          runtime_env=runtime_env,
    68          max_retries=self.config.WORKFLOW_STEP_MAX_RETRIES,
    69          retry_exceptions=True,
    70      )
    71      def get_tool_entrypoint_wrapper(*args, **kwargs):
    72          entry_points = get_entry_points(EntrypointGroup.TOOL_ENTRYPOINT)
    73          try:
    74              tool = entry_points[step.tool.package_name].load()
    75          except KeyError as exc:
    76              raise ValueError(f"Tool {step.tool.package_name} not found in entry points") from exc
    77          return workflow.continuation(
    78              tool.options(runtime_env=RuntimeEnv(env_vars=step.env_vars)).bind(*args, **kwargs)
    79          )
```

This ensures each step has the required dependencies regardless of the host environment.

## OpenAI Function Specifications

Each `ToolModel` describes an OpenAI function specification used during plan generation. The LangChain executor binds these specs so the language model understands available actions.

```python
    10  class ToolModel(BaseModel):
    11      name: str
    12      version: str | None = None
    13      default_parameters: dict[str, Any] | None = Field(default_factory=dict)
    14      parameters_spec: dict[str, Any] | None = Field(default_factory=dict)
    15      openai_function_spec: dict[str, Any]
```

```python
    33  def generate_plan(self, prompt: PromptTemplate, **kwargs) -> str:
    34      agent = ChatOpenAI(callbacks=self._callbacks, model=self.config.openai_api_model)
    35      output_parser = StrOutputParser()
    36      if "available_functions" in kwargs:
    37          agent.bind_tools(tools=[tool.openai_function_spec for tool in kwargs["available_functions"]])
    38          output_parser = AgentOutputPlanParser(tools=kwargs["available_functions"])
```

The planner sends these function schemas to OpenAI so it can decide which tools to call in the workflow plan.

## Calling a Tool from a Workflow

Workflow YAML references a tool using the package name and optional version. When executed, the runtime loads the tool entry point and calls it with the provided inputs.

```yaml
steps:
  - name: answer-life-universe-everything
    tool: return-answer-tool@0.1.2
    inputs:
      - name: answer
        value: '{"answer": 42}'
    outputs:
      - name: result
```

Tools are decoupled from the core agent code, making it easy to share capabilities across agents or extend them with custom packages.
