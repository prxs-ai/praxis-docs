# 🛠️ Tool Quickstart

Get your Praxis tool running locally in under 5 minutes.

## 📋 Prerequisites

- Python 3.10-3.13
- `pip` (comes with Python)
- Git

## ⚡ Quick Start

### 1. Create from Template

Go to the [praxis-tool-template](https://github.com/prxs-ai/praxis-tool-template) repository and click the green **"Use this template"** button to create your new tool repository.

### 2. Clone and Setup

```bash
git clone https://github.com/your-username/your-new-tool-repo.git
cd your-new-tool-repo
cd example_tool
```

### 3. Install Dependencies

```bash
pip install -e .
```

{% hint style="info" %}
The `-e` flag installs the package in "editable" mode, so changes to your code are immediately available.
{% endhint %}

### 4. Run Tests

```bash
pytest
```

{% hint style="success" %}
**That's it!** Your tool is ready for development. All tests should pass out of the box.
{% endhint %}

## 🧪 Test Your Tool

Test your tool directly in Python:
```python
import example_tool

# Test with sample data
result = example_tool.main({"test": "data"})
print(result)
```

## 🔧 Directory Structure Overview

Understanding the template structure will help you customize your tool:

```
your-tool-repo/
├── .github/workflows/    # CI/CD automation
│   ├── lint.yml         # Code quality checks
│   └── test.yml         # Automated testing
├── example_tool/        # Main tool directory
│   ├── example_tool/    # Core package
│   │   ├── main.py      # Your business logic goes here
│   │   └── ray_entrypoint.py  # Ray integration wrapper
│   ├── tests/           # Test suite
│   ├── pyproject.toml   # Dependencies and config
│   └── README.md        # Tool documentation
└── docs/               # Additional documentation
```

### Key Files to Customize

| File | Purpose | What to modify |
|------|---------|---------------|
| `main.py` | Core business logic | Replace with your tool's functionality |
| `ray_entrypoint.py` | Input/output validation | Update Pydantic models for your data types |
| `pyproject.toml` | Project configuration | Change name, version, dependencies |
| `tests/` | Test suite | Add tests for your specific functionality |

## 🚀 Next Steps

### 1. Rename Your Tool

Replace `example_tool` with your actual tool name:

```bash
# Rename directories
mv example_tool your_tool_name
mv your_tool_name/example_tool your_tool_name/your_tool_name

# Update import statements in Python files
# Update project name in pyproject.toml
```

### 2. Implement Your Logic

Edit `your_tool_name/main.py` to add your tool's functionality:

```python
def main(data):
    # Your tool logic here
    return {"result": "processed data"}
```
### 3. Update Input/Output Models

Modify the Pydantic models in `ray_entrypoint.py` to match your data:

```python
class InputModel(BaseModel):
    user_input: str
    options: dict = {}

class OutputModel(BaseModel):
    processed_result: str
    metadata: dict = {}
```

### 4. Write Tests

Add comprehensive tests in `tests/test_example.py`:

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
# Check code formatting and style
ruff check .

# Auto-format code
ruff format .
```

### Run Tests with Coverage

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=your_tool_name
```

## 🐳 What's Different from Agents?

{% hint style="info" %}
**Tools vs Agents:**

- **Tools** are focused, single-purpose functions that process data
- **Agents** are complex, stateful entities that can use multiple tools
- **Tools** use Ray for distributed execution and scaling
- **Agents** use Ray Serve for web APIs and persistent services
{% endhint %}

## 💡 Example Tool Ideas

Perfect use cases for Praxis tools:

- **Data processors:** Transform CSV files, clean datasets, extract information
- **API integrations:** Connect to external services, fetch data, send notifications  
- **Utility functions:** Generate reports, validate data, perform calculations
- **Content generators:** Create summaries, translations, format conversions
## 🔗 Template Repository

**GitHub Repository:** [praxis-tool-template](https://github.com/prxs-ai/praxis-tool-template)

The template provides:
- ✅ Ray integration for distributed execution
- ✅ Pydantic models for type safety
- ✅ Complete test suite with pytest
- ✅ CI/CD workflows with GitHub Actions
- ✅ Code quality tools (ruff linting)
- ✅ Production-ready project structure

## 🚨 Troubleshooting

### Common Issues

**❌ `ModuleNotFoundError: No module named 'example_tool'`**

```bash
# Install package in editable mode
pip install -e .
```

**❌ `ImportError: cannot import name 'main'`**

```bash
# Check your import paths after renaming
# Ensure __init__.py files exist in all directories
```

**❌ Tests failing after customization**

```bash
# Update test imports to match your renamed package
# Verify your main() function signature matches expectations
```

**❌ Ray import errors**

```bash
# Install with development dependencies
pip install -e .[dev]
```

## 💡 Tips for Success

{% hint style="success" %}
**Best Practices:**

- Keep tools focused on a single responsibility
- Use type hints and Pydantic for robust data validation
- Write comprehensive tests before deploying
- Follow the existing project structure for consistency
- Use descriptive names for your tool and functions
{% endhint %}

## 🆘 Getting Help

**Need support?**

- Check the [praxis-tool-template README](https://github.com/prxs-ai/praxis-tool-template/blob/main/README.md) for detailed documentation
- Review the example implementation in the template
- Browse existing issues on GitHub
- Create a new issue with reproduction steps

---

**Ready to build your first Praxis tool?** 🚀 

[**Use the Template**](https://github.com/prxs-ai/praxis-tool-template/generate) and start coding!