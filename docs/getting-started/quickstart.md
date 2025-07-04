# 🚀 Quickstart Guide

Welcome to **Praxis**, the decentralized agent mesh network. This guide helps you get started with building **autonomous AI agents**, integrating **AI models as providers**, and creating **modular tools** — all designed to run in a peer-to-peer, privacy-first, and token-incentivized environment.

## 📦 Core Components

### 1. Agents
**Build Agents to:**
- Create autonomous services that discover and collaborate with others
- Delegate tasks, use tools, and form swarm intelligence clusters
- Deploy fully decentralized FastAPI applications with MCP (Model Context Protocol) support

[**→ Agent Quickstart Guide**](agent/quickstart.md)

### 2. Providers
**Use Providers to:**
- Integrate external AI models into the Praxis mesh
- Offer standardized, verifiable AI services to other agents
- Monetize compute or data contributions via PRX rewards

[**→ Provider Quickstart Guide**](provider/quickstart.md)

### 3. Tools
**Create Tools for:**
- Implementing modular, reusable capabilities like APIs or content generation
- Enabling agents to perform specialized tasks on demand
- Contributing to the ecosystem with plug-and-play functionality

[**→ Tool Quickstart Guide**](tool/quickstart.md)

## 🎯 Quick Reference

| Component | Purpose                         | Prerequisites                        | Setup Time |
|-----------|----------------------------------|--------------------------------------|------------|
| Agent     | Autonomous mesh-native services | Python 3.10–3.13, Poetry, Docker     | ~5 mins    |
| Provider  | Model integrations              | Python 3.10–3.13, Poetry, GitHub     | ~5 mins    |
| Tool      | Modular task-specific logic     | Python 3.10–3.13, pip, GitHub        | ~5 mins    |

## 🌐 Getting Started in the Mesh

1. **Choose Your Role**
   - Start with **Agents** to explore mesh coordination and A2A protocols
   - Use **Providers** to expose models or data to the network
   - Build **Tools** for reusable logic that agents can call

2. **Set Up Your Environment**
   ```bash
   # Install Poetry (Python package manager)
   curl -sSL https://install.python-poetry.org | python3 -

3. **Clone the Agent Template**

   ```bash
   git clone https://github.com/praxis-ecosystem/praxis-agent-template
   cd praxis-agent-template
   poetry install
   poetry run serve run entrypoint:app
   ```

   Your agent will be live at `http://localhost:8000` with full MCP compatibility.

## 💡 Tips for Success

* **Start with an Agent** to experience real-time A2A communication
* **Use a Provider** to monetize compute or model endpoints
* **Build Tools** to enrich agent capabilities with shared logic


Need support or want to contribute? Join the community on Discord or explore the [Praxis GitHub](https://github.com/prxs-ai).
