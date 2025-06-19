# 🛠️ Provider Quickstart

Get your Praxis provider running locally in under 5 minutes.

## 📋 Prerequisites

- Python 3.10-3.13
- Poetry (for dependency management)
- GitHub account (to use the template)

## ⚡ Quick Start

### 1. Generate Your Provider Repository

Use the GitHub template to create your own provider:

1. Go to [praxis-provider-template](https://github.com/prxs-ai/praxis-provider-template)
2. Click **"Use this template"** → **"Create a new repository"**
3. Name your repository (e.g., `my-awesome-provider`)
4. Clone your new repository:

```bash
git clone https://github.com/YOUR-USERNAME/my-awesome-provider
cd my-awesome-provider
```

{% hint style="info" %}
The template includes pre-configured code quality tools, CI/CD workflows, and a working example provider.
{% endhint %}

### 2. Install Dependencies

```bash
# Install Poetry if you haven't already
curl -sSL https://install.python-poetry.org | python3 -

# Install provider dependencies
poetry install --with dev
```

### 3. Run the Example Provider

```bash
# Start the provider using Ray Serve
poetry run serve run src.example_provider.ray_entrypoint:app
```

{% hint style="success" %}
**That's it!** Your provider is now running at `http://localhost:8000`
{% endhint %}

## 🧪 Test Your Provider

### Run Tests

```bash
# Run tests if they exist
make test

# Or directly with poetry
poetry run pytest
```

{% hint style="info" %}
The template's test command checks if tests exist before running them. If no tests are found, it will display a warning message.
{% endhint %}

### Check Code Quality

```bash
# Run all pre-commit checks
make precommit

# Or run individual checks
poetry run ruff check .
poetry run mypy .
```

## 📁 Directory Structure

```
my-awesome-provider/
├── src/
│   └── example_provider/
│       └── ray_entrypoint.py    # Provider entry point
├── tests/                        # Test files (optional)
├── docs/
│   └── CONTRIBUTING.md          # Contribution guidelines
├── .github/
│   └── workflows/
│       └── tests.example-provider.yml  # CI/CD pipeline
├── pyproject.toml               # Poetry config & tool settings
├── Makefile                     # Development shortcuts
├── .pre-commit-config.yaml      # Code quality hooks
├── .bumpversion.toml            # Version management
├── .gitignore                   # Git ignore patterns
├── LICENSE                      # MIT License
└── README.md                    # Your provider documentation
```

## 🔧 Configuration

### Provider Settings

Edit `pyproject.toml` to customize your provider:

```toml
[project]
name = "my-awesome-provider"
version = "0.1.0"
description = "My custom Praxis provider"
authors = [{name = "Your Name", email = "you@example.com"}]

[project.entry-points."provider.entrypoint"]
my-awesome-provider = "my_provider.ray_entrypoint:app"
```

### Code Quality Tools

The template includes pre-configured tools:

- **Ruff**: Fast Python linter and formatter
- **MyPy**: Static type checker
- **Pre-commit**: Automated checks before commits

## 🚀 Development Workflow

### 1. Create Your Provider Class

Replace the example provider in `src/example_provider/ray_entrypoint.py`:

```python
from base_provider.ray_entrypoint import BaseProvider
from fastapi import FastAPI
from ray import serve

app = FastAPI()

@serve.deployment
@serve.ingress(app)
class MyAwesomeProvider(BaseProvider):
    def __init__(self):
        super().__init__()
        # Initialize your provider
    
    # Add your custom methods here

app = MyAwesomeProvider.bind()
```

### 2. Add Your Tools

Implement your provider-specific tools and endpoints:

```python
@app.post("/execute-tool")
async def execute_tool(tool_name: str, params: dict):
    # Your tool execution logic
    return {"result": "success"}
```

### 3. Test Everything

```bash
# Format your code
make format

# Run linters
make lint

# Run tests
make test

# Or run everything at once
make check
```

## 🐳 Docker Support (Optional)

{% hint style="info" %}
The template doesn't include Docker files by default. You can add Docker support if needed for containerized deployment.
{% endhint %}

To add Docker support:

```dockerfile
# Create a Dockerfile in your provider root
FROM python:3.11-slim

WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy project files
COPY pyproject.toml poetry.lock* ./
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy source code
COPY src/ ./src/

# Run the provider
CMD ["poetry", "run", "serve", "run", "src.example_provider.ray_entrypoint:app"]
```

## 🚨 Troubleshooting

### Common Issues

**❌ `Poetry: command not found`**

```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -
# Add to PATH
export PATH="$HOME/.local/bin:$PATH"
```

**❌ `No module named 'base_provider'`**

```bash
# The template already has Praxis repositories configured
# Check your pyproject.toml for:
[[tool.poetry.source]]
name = "praxis-providers"
url = "https://providers.pypi.prxs.ai/simple/"
priority = "supplemental"

# If missing, add it and reinstall:
poetry install
```

**❌ Pre-commit hook failures**

```bash
# Auto-fix formatting issues
make format

# Then try committing again
git add .
git commit -m "Your message"
```

## 📚 Next Steps

- Check the full [praxis-provider-template](https://github.com/prxs-ai/praxis-provider-template) repository
- Read the [Contributing Guide](https://github.com/prxs-ai/praxis-provider-template/blob/main/docs/CONTRIBUTING.md)
- Explore the [BaseProvider API documentation](#)
- Join the Praxis community for support

## 💡 FAQ

**Do I need Ray Serve?**
Yes! The provider template uses Ray Serve for scalable API deployment. It's included in the dependencies.

**Can I add custom dependencies?**
Absolutely! Add them to `pyproject.toml` in the `[tool.poetry.dependencies]` section:

```bash
# Add a new dependency
poetry add your-package

# Add a dev dependency
poetry add --group dev your-dev-package
```

**How do I deploy my provider?**
The template includes Docker support and CI/CD workflows. Check the repository README for deployment options.