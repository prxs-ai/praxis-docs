# 🚀 Quickstart

Get your Praxis agent running locally in under 5 minutes.

## 📋 Prerequisites

- Python 3.10-3.13
- Poetry (for dependency management)
- Docker (for Redis only)

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-org/praxis-agent-template
cd praxis-agent-template
poetry install
```

### 2. Start Redis

```bash
docker-compose up redis -d
```

{% hint style="info" %}
Redis is required for the agent's memory system. We use Docker for convenience, but you can run Redis however you prefer.
{% endhint %}

### 3. Run Your Agent

```bash
OPENAI_API_KEY=your-key-here REDIS_HOST=localhost poetry run serve run entrypoint:app
```

{% hint style="success" %}
**That's it!** Your agent is now running at `http://localhost:8000`
{% endhint %}

## 🧪 Test Your Agent

Open your browser to `http://localhost:8000/docs` to see the FastAPI interface and test your agent.

## 🔧 Configuration

### Environment Variables

| Variable           | Required | Default   | Description                                              |
| ------------------ | -------- | --------- | -------------------------------------------------------- |
| `OPENAI_API_KEY` | ✅       | -         | Your OpenAI API key                                      |
| `REDIS_HOST`     | ✅       | `redis` | Redis hostname (use `localhost` for local development) |
| `REDIS_PORT`     | ❌       | `6379`  | Redis port                                               |

### Custom Configuration

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=sk-...
REDIS_HOST=localhost
REDIS_PORT=6379
```

Then run with:

```bash
poetry run serve run entrypoint:app
```

## 🐳 Docker Alternative

{% hint style="warning" %}
**Docker is optional** - the above local installation is the recommended approach for development.
{% endhint %}

The included Dockerfile is provided for convenience if you need to:

- Install system-level packages (databases, tools, etc.)
- Create reproducible deployment environments
- Package your agent for distribution

**For most development work, skip Docker and use the local setup above.**

If you do want to use Docker for your entire stack:

```bash
# Build the agent image
docker-compose build

# Run everything
OPENAI_API_KEY=your-key-here docker-compose up
```

## 🎯 Next Steps

- **[Agent Development](./development.md)** - Learn how to customize your agent
- **[Tools Integration](./tools.md)** - Add custom tools and capabilities
- **[Deployment](./deployment.md)** - Deploy to production
- **[Examples](./examples.md)** - See real-world agent implementations

## 🚨 Troubleshooting

### Common Issues

**❌ `serve: command not found`**

```bash
# Use poetry run
poetry run serve run entrypoint:app
```

**❌ `ValidationError: openai_api_key Field required`**

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk-your-key-here
```

**❌ `ConnectionError: Error while reading from redis:6379`**

```bash
# Set Redis host for local development
export REDIS_HOST=localhost
```

**❌ Redis connection refused**

```bash
# Make sure Redis is running
docker-compose up redis -d
# Or install Redis locally: brew install redis && redis-server
```

## 💡 FAQ

**Do I need Docker?**
No! Docker is only used for Redis in this quickstart. You can install Redis locally or use a managed Redis service.

**Do I need a Dockerfile for my agent?**
No! The Dockerfile in this template is optional. Your agent runs perfectly with just `poetry install` and the local Python environment. The Dockerfile is only provided as an example if you want to:

- Install additional system packages (like `curl`, `git`, etc.)
- Create a containerized deployment
- Add custom system-level dependencies

For most use cases, the local Poetry installation is the recommended approach.
