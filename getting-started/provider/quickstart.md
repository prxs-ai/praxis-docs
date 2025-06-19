# 🛠️ Provider Quickstart

Spin up your **Praxis Tool Provider** in under 5 minutes.

A *Provider* is a modular, reusable service that exposes tools to agents inside the Praxis mesh. Providers are deployed using [Ray Serve](https://docs.ray.io/en/latest/serve/index.html), making them scalable and composable.

## 📋 Prerequisites

- Python 3.10–3.13
- [Poetry](https://python-poetry.org/)
- GitHub account (to fork the template)

## ⚡ Quick Start

### 1. Create Your Provider Repository

Start with the Praxis template:

1. Visit [praxis-provider-template](https://github.com/prxs-ai/praxis-provider-template)
2. Click **Use this template** → **Create a new repository**
3. Name your repo (e.g., `currency-exchange-provider`)
4. Clone your new provider:

```bash
git clone https://github.com/YOUR-USERNAME/currency-exchange-provider
cd currency-exchange-provider
````

{% hint style="info" %}
The template includes linting, tests, CI/CD, and a minimal working provider to get you started fast.
{% endhint %}

### 2. Install Dependencies

```bash
# Install Poetry if needed
curl -sSL https://install.python-poetry.org | python3 -

# Install Python dependencies
poetry install --with dev
```

### 3. Run Your Provider

```bash
poetry run serve run src.example_provider.ray_entrypoint:app
```

{% hint style="success" %}
✅ Your provider is now available at `http://localhost:8000`. It’s ready to expose tools to Praxis agents.
{% endhint %}

---

## 🧪 Testing Your Provider

### Run Tests

```bash
make test
# or
poetry run pytest
```

### Check Code Quality

```bash
make lint
# or
poetry run ruff check .
poetry run mypy .
```

---

## 📁 Project Structure

```
currency-exchange-provider/
├── src/
│   └── example_provider/
│       └── ray_entrypoint.py   # Entry point for Ray Serve
├── tests/                      # Unit and integration tests
├── docs/                       # Contribution docs
├── .github/                    # CI/CD workflows
├── pyproject.toml              # Poetry + tool config
├── Makefile                    # Developer shortcuts
├── .pre-commit-config.yaml     # Git hooks
└── README.md                   # Your provider documentation
```

---

## 🔧 Configuration

### pyproject.toml

Update the entry point and metadata:

```toml
[project]
name = "currency-exchange-provider"
version = "0.1.0"
description = "Tool provider for currency conversion"
authors = [{ name = "Your Name", email = "you@example.com" }]

[project.entry-points."provider.entrypoint"]
currency-exchange = "example_provider.ray_entrypoint:app"
```

### Code Quality Stack

* 🧹 `ruff` — Linting & formatting
* 🔍 `mypy` — Type checking
* ✅ `pre-commit` — Local Git hooks for fast feedback

Run everything with:

```bash
make check
```

---

## ⚙️ Developing a Provider

### Step 1: Extend the BaseProvider

Edit `ray_entrypoint.py`:

```python
from base_provider.ray_entrypoint import BaseProvider
from fastapi import FastAPI
from ray import serve

app = FastAPI()

@serve.deployment
@serve.ingress(app)
class CurrencyExchangeProvider(BaseProvider):
    def __init__(self):
        super().__init__()

    @app.post("/convert")
    async def convert_currency(self, from_currency: str, to_currency: str, amount: float):
        # Example logic
        return {"converted_amount": amount * 0.92}  # Dummy rate

app = CurrencyExchangeProvider.bind()
```

### Step 2: Add Tool Metadata (optional)

You can expose tool descriptions via your own endpoints, or follow [Praxis Tool schema](tool/overview.md).

---

## 🐳 Docker Support (Optional)

If you want to containerize:

```dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock* ./
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction

COPY src/ ./src/

CMD ["poetry", "run", "serve", "run", "src.example_provider.ray_entrypoint:app"]
```

Build and run:

```bash
docker build -t my-provider .
docker run -p 8000:8000 my-provider
```

---

## 🚨 Troubleshooting

### `Poetry: command not found`

```bash
curl -sSL https://install.python-poetry.org | python3 -
export PATH="$HOME/.local/bin:$PATH"
```

### `ModuleNotFoundError: No module named 'base_provider'`

Ensure `pyproject.toml` includes:

```toml
[[tool.poetry.source]]
name = "praxis-providers"
url = "https://providers.pypi.prxs.ai/simple/"
priority = "supplemental"
```

Then run:

```bash
poetry install
```

### Pre-commit Failures

```bash
make format
git add .
git commit -m "Fix formatting"
```

---

## 📚 Next Steps

* 📘 [praxis-provider-template](https://github.com/prxs-ai/praxis-provider-template)
* 🤝 [Contributing Guide](https://github.com/prxs-ai/praxis-provider-template/blob/main/docs/CONTRIBUTING.md)
* 📦 [base\_provider API docs](#)
* 🌐 Register your provider in the [Praxis Registry](registry/overview.md)

---

## 💡 FAQ

**Do I need Ray Serve?**
Yes. Praxis uses Ray Serve to scale provider endpoints and manage tool dispatch.

**Can I add custom dependencies?**
Yes:

```bash
poetry add numpy
poetry add --group dev pytest
```

**How do I deploy to the mesh?**
You can package your provider via Docker and register it with the Praxis Registry. See [Registry Quickstart](registry/quickstart.md) for details.
