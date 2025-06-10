# Workflow DSL Overview

The Praxis SDK defines workflows using a simple YAML DSL. A workflow describes
an ordered list of steps that invoke tools with specific inputs and produce
outputs that later steps can reference. This declarative format allows agents to
plan complex tasks that run in Ray without writing Python code.

## Basic Structure

```yaml
id: answer-life-universe-everything
name: answer-life-universe-everything
description: Returns the answer to the question of life, universe and everything
steps:
  - name: answer-life-universe-everything
    tool: return_answer_tool@0.1.2
    inputs:
      - name: answer
        value: '{"answer": 42}'
    outputs:
      - name: result
outputs:
  - name: answer
    value: "{{steps.answer-life-universe-everything.outputs.result}}"
```

The top-level keys are:

- `id` – A unique identifier for the workflow. Must be unique within your organization and should use kebab-case formatting (lowercase with hyphens).
- `name` – A human-friendly name. Often matches `id` but can be more descriptive and include spaces.
- `description` – What the workflow accomplishes. Should be clear and concise to help users understand the workflow's purpose.
- `steps` – Ordered list of steps executed by the workflow runner. Steps are executed sequentially in the order defined.
- `outputs` – Final values exported after all steps complete. These represent the workflow's results.

### Steps

Each step has its own keys:

- `name` – Identifier for the step so later steps can reference its outputs. Must be unique within the workflow and should use kebab-case formatting.
- `tool` – The tool to run, including optional version (e.g. `foo@1.0.0`). Tools are discovered via the AI registry service and installed dynamically if missing. If no version is specified, the latest version is used.
- `inputs` – Parameters passed to the tool. Static values are provided directly,
  or you can reference prior outputs using the `{{ ... }}` templating syntax. Each input has:
  - `name`: The parameter name expected by the tool
  - `value`: The parameter value, which can be a literal or a template expression
- `outputs` – Names of outputs the tool will return. These become available for
  subsequent steps. Each output requires:
  - `name`: An identifier used to reference this output in subsequent steps

### Outputs

The workflow `outputs` section exposes values from individual steps. Use the
Jinja-style `{{steps.<step>.outputs.<name>}}` notation to copy a result. This
makes it easy to compose multi-step procedures where one tool feeds data to the
next.

## Writing Your Own Workflow

1. Give the workflow an `id`, `name`, and `description` so it can be referenced.
2. Define each `step` with the tool to run and any inputs.
3. Specify which outputs you need from each step.
4. Reference step outputs in later inputs or in the workflow's final `outputs`.
5. Save the YAML file and point the runtime at it when executing.

The DSL is intentionally small so workflows remain easy to read while covering
common automation needs. Tools can perform API calls, run code, or even hand off
tasks to other agents, enabling complex interactions without writing custom
logic in the workflow file itself.
