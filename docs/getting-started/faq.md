# ❓ FAQ

Common questions about building and deploying Praxis agents.

## 🐳 Do I need a Dockerfile in the agent template?


**No, a Dockerfile is completely optional!**


The praxis-agent-template includes a Dockerfile, but you don't need it for most use cases:

### ✅ You DON'T need Docker if:



- You're developing locally (recommended approach)
- You're deploying to a managed Python environment
- You're using Poetry for dependency management
- You want the fastest development experience
  

### 🐳 You DO need Docker if:



- You need to install system-level packages (databases, CLI tools, etc.)
- You're deploying to container orchestration platforms (Kubernetes, etc.)
- You want reproducible deployment environments
- You're distributing your agent as a container
  

### 📦 What the included Dockerfile does:

The template's Dockerfile:

- Uses `harbor.dev.prxs.ai/docker/agents:v0.0.6` as base image
- Copies your Python code and dependencies
- Provides a containerized runtime environment


**Bottom line:** Start with the local Poetry setup from the [Quickstart](quickstart.md). Only use Docker if you specifically need containerization features.


---

## 🔧 How to package my agent using CI?

The praxis-agent-template includes automated CI/CD that handles packaging for you:

### 🚀 Automatic Packaging


When you push a version tag, GitHub Actions automatically:

1. **Python Package:** Builds and publishes to the Praxis Python registry
2. **Docker Image:** Builds and publishes to the Praxis OCI registry (if Dockerfile exists)
   

### 📋 Steps to Release:

**1. Prepare your release:**

```bash
# Make sure your changes are committed
git add .
git commit -m "Ready for release"  
git push
```

**2. Trigger the release:**

- Go to GitHub Actions in your repository
- Run the "Release example-agent" workflow
- Choose version bump: `major`, `minor`, or `patch`

**3. Automatic publishing:**

- CI builds your agent as a Python package
- If you have a Dockerfile, CI builds a Docker image too
- Both are published to Praxis registries

### 🏗️ What gets packaged:

**Python Package**

- Your agent code from `src/`
- Dependencies from `pyproject.toml`
- Entry points for the agent
- **Published to:** `https://agents.pypi.prxs.ai/`
  

**Docker Image**

- Complete containerized environment
- Only built if `Dockerfile` exists in your repo
- **Published to:** `harbor.dev.prxs.ai/`
  
  

### 🔍 Customizing the build:

| Component                  | How to customize                                                  |
| -------------------------- | ----------------------------------------------------------------- |
| **Python packaging** | Edit `pyproject.toml` for dependencies, entry points, metadata  |
| **Docker packaging** | Edit `Dockerfile` for base image, system deps, runtime config   |
| **CI behavior**      | Edit `.github/workflows/` for triggers, build steps, registries |

---

## 🛠️ Development vs Production


🏠 **Local Development**

```bash
poetry install                           # Install dependencies
poetry run serve run entrypoint:app     # Run locally  
```



🚀 **Production Deployment**

```bash
# Option 1: Python package
pip install your-agent-package
serve run your_agent.entrypoint:app

# Option 2: Docker container
docker run your-agent-image
```




---

## 🛠️ Tools vs Agents - What's the difference?


**Understanding the distinction between Praxis Tools and Agents helps you choose the right approach for your project.**


### 🤖 **Agents** (what this FAQ covers)


🎯 **Purpose**
- **Complex, stateful entities** that can use multiple tools
- **Conversational interfaces** with memory and context
- **Web APIs** using Ray Serve for persistent services
- **Multi-step workflows** and decision making


🔧 **Tech Stack**
- **Ray Serve** for web API hosting
- **Poetry** for dependency management  
- **Redis** for memory and state storage
- **FastAPI** integration for REST endpoints


💡 **Examples**
- Chatbots and virtual assistants
- Workflow orchestrators
- Multi-tool decision engines
- Customer service agents



### 🛠️ **Tools** (distributed functions)

🎯 **Purpose**
- **Focused, single-purpose functions** that process data
- **Stateless operations** with clear input/output
- **Distributed execution** using Ray for scaling
- **Building blocks** that agents can use


🔧 **Tech Stack**
- **Ray** (not Ray Serve) for distributed execution
- **Pydantic** for input/output validation
- **pip** for simpler dependency management
- **Entry points** for tool discovery


💡 **Examples**
- Data processors and transformers
- API integrations and connectors
- Utility functions and calculators
- Content generators and analyzers



### 🤔 **Which should I choose?**

| Use Case | Choose | Why |
|----------|---------|-----|
| **Need persistent state/memory** | Agent | Agents maintain context across interactions |
| **Simple data processing** | Tool | Tools are lightweight and focused |
| **Web API endpoint** | Agent | Agents use Ray Serve for HTTP services |
| **Function used by other systems** | Tool | Tools are designed to be building blocks |
| **Complex decision making** | Agent | Agents can orchestrate multiple tools |
| **Single transformation** | Tool | Tools excel at focused operations |


**Getting started with Tools?** Check out the [Tool Quickstart](../tool/quickstart.md) guide!


---

## 🆘 Getting Help


**Having issues?**

- Check the [Quickstart](quickstart.md) for setup help
- Review your `pyproject.toml` configuration
- Verify your environment variables
- Check CI logs in GitHub Actions
  


**Need more help?**

- Check existing GitHub issues
- Create a new issue with reproduction steps
  
