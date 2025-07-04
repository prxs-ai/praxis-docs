# 🛠️ Tool Quickstart

Get your Praxis tool running locally in under 5 minutes — the first step to joining the decentralized agent mesh network.

## 📋 Prerequisites

- Python 3.10–3.13  
- `pip` (included with Python)  
- Git  

## ⚡ Quick Start

### 1. Create from Template

Visit the [praxis-tool-template](https://github.com/prxs-ai/praxis-tool-template) repository and click **"Use this template"** to create your own tool repository. This template is built to integrate seamlessly into the Praxis mesh ecosystem, supporting modular, peer-to-peer compatible AI tools.

### 2. Clone and Setup

```bash
git clone https://github.com/your-username/your-new-tool-repo.git
cd your-new-tool-repo
cd example_tool
````

### 3. Install Dependencies

```bash
pip install -e .
```

{% hint style="info" %}
Installing with `-e` enables editable mode so your code changes are immediately reflected.
{% endhint %}

### 4. Run Tests

```bash
pytest
```

{% hint style="success" %}
**Done!** Your tool is now ready for development, fully compatible with Praxis's decentralized mesh network.
{% endhint %}

## 🧪 Test Your Tool

Test your tool quickly with:

```python
import example_tool

result = example_tool.main({"test": "data"})
print(result)
```

## 🔧 Template Structure

The template is designed with modularity and scalability in mind, aligning with Praxis’s vision of flexible, composable AI agents and tools.

```
your-tool-repo/
├── .github/workflows/    # CI/CD automation (linting, tests)
├── example_tool/         # Core tool package
│   ├── main.py          # Tool business logic
│   ├── ray_entrypoint.py # Ray-based execution and validation
│   ├── tests/           # Unit and integration tests
│   ├── pyproject.toml   # Dependency and project config
│   └── README.md        # Tool-specific documentation
└── docs/                 # Additional docs and examples
```

### Key Files to Customize

| File                | Purpose                   | Customize To                               |
| ------------------- | ------------------------- | ------------------------------------------ |
| `main.py`           | Core logic                | Implement your tool's unique processing    |
| `ray_entrypoint.py` | I/O validation & wrapping | Adapt Pydantic models to your data types   |
| `pyproject.toml`    | Project config            | Update project name, dependencies, version |
| `tests/`            | Automated tests           | Add test cases covering your logic         |

## 🚀 Next Steps

### 1. Rename Your Tool

Replace `example_tool` with your tool’s name throughout the code and filesystem:

```bash
# Rename directories
mv example_tool your_tool_name
mv your_tool_name/example_tool your_tool_name/your_tool_name

# Update import statements in Python files accordingly
# Update project name and metadata in pyproject.toml
```

### 2. Implement Your Logic

Edit `your_tool_name/main.py` to add your tool's core functionality:

```python
def main(data):
    # Your tool logic here
    return {"result": "processed data"}
```

### 3. Update Input/Output Models

Modify the Pydantic models in `ray_entrypoint.py` to match your expected input and output schemas:

```python
from pydantic import BaseModel

class InputModel(BaseModel):
    user_input: str
    options: dict = {}

class OutputModel(BaseModel):
    processed_result: str
    metadata: dict = {}
```

### 4. Write Tests

Add thorough tests in `tests/test_example.py` to cover your tool’s logic:

```python
import pytest
from your_tool_name import main

def test_your_functionality():
    result = main({"input": "test"})
    assert "result" in result
```

## 🔍 Development Workflow

### Run Code Quality Checks

```bash
# Lint your code
ruff check .

# Auto-format code
ruff format .
```

### Run Tests with Coverage

```bash
# Run tests
pytest

# Run tests with coverage report
pytest --cov=your_tool_name
```

## 🐳 What’s Different from Agents?

{% hint style="info" %}
**Tools vs Agents:**

* **Tools** are focused, stateless, single-purpose functions designed for distributed execution with Ray.
* **Agents** are stateful, complex entities that can orchestrate multiple tools, often running persistent services with Ray Serve.
* Praxis tools integrate seamlessly into the decentralized mesh, enabling scalable AI workflows.
  {% endhint %}

## 💡 Example Tool Ideas

* Data processors (e.g., CSV cleaning, extraction)
* API connectors (fetching or sending data)
* Utility functions (report generators, validators)
* Content creators (summaries, translations, format converters)

## 🔗 Template Repository

[GitHub: praxis-tool-template](https://github.com/prxs-ai/praxis-tool-template)

Features:

* Ray integration for distributed execution
* Pydantic models for type safety
* Pytest-based test suite
* GitHub Actions CI/CD workflows
* Ruff for linting and formatting
* Production-ready modular project structure

## 🚨 Troubleshooting

### Common Issues

* **`ModuleNotFoundError: No module named 'example_tool'`**
  Run: `pip install -e .`

* **`ImportError` after renaming**
  Check import paths and ensure `__init__.py` files exist.

* **Tests fail after customization**
  Update test imports and verify main function signatures.

* **Ray import errors**
  Install development dependencies:
  `pip install -e .[dev]`

## 💡 Tips for Success

{% hint style="success" %}

* Keep tools focused on one responsibility
* Use Pydantic and type hints for data validation
* Write tests before deploying
* Follow the template’s structure for consistency
* Choose clear, descriptive names
  {% endhint %}

## 🆘 Getting Help

* See the [praxis-tool-template README](https://github.com/prxs-ai/praxis-tool-template/blob/main/README.md)
* Review example implementations
* Search or open issues on GitHub

---

Ready to build your first Praxis tool? 🚀

[Use the Template](https://github.com/prxs-ai/praxis-tool-template) and start coding!
