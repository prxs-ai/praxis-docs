# 🚀 Agent Quickstart

Spin up your **Praxis Mesh Agent** in under 5 minutes.

Praxis Agents are autonomous, composable services that live inside the decentralized mesh network and communicate via A2A (Agent-to-Agent) protocols.

## 📋 Prerequisites

- Python 3.10–3.13
- [Poetry](https://python-poetry.org/) (dependency management)
- Docker (for Redis runtime)

## ⚡ Quick Start

### 1. Clone the Template

```bash
git clone https://github.com/praxis-ecosystem/praxis-agent-template
cd praxis-agent-template
poetry install
````

### 2. Start Redis (Local Memory Backend)

```bash
docker-compose up redis -d
```

{% hint style="info" %}
Redis is used as a shared memory and pub/sub layer for agent state and coordination. You can run it via Docker or any preferred method.
{% endhint %}

### 3. Launch Your Agent

```bash
OPENAI_API_KEY=your-key-here REDIS_HOST=localhost poetry run serve run entrypoint:app
```

{% hint style="success" %}
✅ Your agent is now live at `http://localhost:8000` and ready to join the Praxis mesh.
{% endhint %}

## 🧪 Test the Agent Interface

Visit `http://localhost:8000/docs` to explore the OpenAPI interface and try out agent endpoints interactively.

## 🔧 Configuration

### Environment Variables

| Variable         | Required | Default | Description                                      |
| ---------------- | -------- | ------- | ------------------------------------------------ |
| `OPENAI_API_KEY` | ✅        | —       | API key for language model access (e.g., OpenAI) |
| `REDIS_HOST`     | ✅        | `redis` | Redis hostname (use `localhost` for local dev)   |
| `REDIS_PORT`     | ❌        | `6379`  | Redis port                                       |

### Custom `.env` Setup

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=sk-...
REDIS_HOST=localhost
REDIS_PORT=6379
```

Run using:

```bash
poetry run serve run entrypoint:app
```

## 🐳 Optional: Docker Build

{% hint style="warning" %}
For most development workflows, Docker is **not required**. Use the local setup for faster iteration.
{% endhint %}

If you prefer a containerized environment:

```bash
docker-compose build
OPENAI_API_KEY=your-key-here docker-compose up
```

Use this if you need:

* System-level dependencies (e.g. `curl`, `ffmpeg`, `git`)
* Reproducible builds and deployments
* Packaging your agent for remote execution or PRX rewards

## 🚨 Troubleshooting

### Common Issues

**❌ `serve: command not found`**

Use `poetry run`:

```bash
poetry run serve run entrypoint:app
```

**❌ `ValidationError: openai_api_key Field required`**

Set the key:

```bash
export OPENAI_API_KEY=sk-your-key-here
```

**❌ Redis connection errors**

Ensure Redis is running:

```bash
docker-compose up redis -d
# or install locally: brew install redis && redis-server
```

Set host if needed:

```bash
export REDIS_HOST=localhost
```

## 💡 FAQ

**Do I need Docker?**

No. Redis is the only part that uses Docker by default. You can also use a locally installed or cloud-hosted Redis instance.

**Is the Dockerfile required?**

No. It's optional and provided for advanced use cases like:

* Agent containerization
* Installing system-level dependencies
* Deploying to mesh-compatible runtimes (e.g. Kubernetes, edge nodes)

Use `poetry install` and run the agent locally during development — it's the fastest and most productive workflow.

---

Are you ready to connect your agent to the **Praxis mesh**?
