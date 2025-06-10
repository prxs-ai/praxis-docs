# Relay

Praxis Internal Service Reference
*Last updated: 2025-06-09*

---

## Overview

The **Relay** service is Praxis’s internal peer-to-peer communication fabric, built on **libp2p CircuitV2** and deployed in our Kubernetes cluster. It enables NAT traversal and encrypted agent-to-agent (A2A) messaging by combining FastAPI for REST endpoints, Redis for peer registry, and a TCP relay node for secure routing.

### Key Features

* **CircuitV2 Relay**: libp2p-based TCP relay node with hop/stop enabled.
* **FastAPI Endpoints**: REST API to register and discover agents.
* **Redis TTL Store**: Ephemeral peer state with configurable expiry.


### Role Within Praxis

Relay is the connective tissue of the Praxis agent ecosystem. It allows AI agents, the orchestrator, and external interfaces to communicate reliably and securely. It's used for action delegation, broadcasting agent state updates, and coordinating workflows.

---

## How It Works

The Relay service has two primary components:

1. **Relay Host**: A CircuitV2-based libp2p node launched during FastAPI's lifespan. It exposes a TCP endpoint (port 9000) for peer-to-peer traffic.
2. **FastAPI API**: REST interface for agents to register themselves and query others.

Agents use `/register` to announce themselves to the relay service and `/peers` to discover reachable peers. Redis stores these entries with a 1-hour TTL (configurable). The service supports both direct peer fetches and filtered queries by agent name.


### Basic Flow

1. Agent A connects to Relay via WebSocket.
2. Agent B connects to Relay and subscribes to its topic.
3. Agent A publishes a task to Agent B’s topic.
4. Agent B replies to the response topic.

### Sequence Diagram

![`relay_sequence_diagram`](images/diagrams/relay_service_sequence.png)

---

## Architecture Diagrams

### C4 Context Diagram

![`relay_context_diagram`](images/diagrams/relay_service_context.png)

---

## OpenAPI Specification

* [View Relay Swagger UI](https://relay-service.dev.prxs.ai/docs#/)

---

## Example API Payloads

### Register Peer (`POST /register`)

```json
{
  "agent_name": "example-agent@v0.0.1",
  "peer_id": "Qm...",
  "addrs": [
    "/ip4/1.2.3.4/tcp/4001",
    "/dns4/example.com/tcp/4001"
  ]
}
```

*Registers a peer into Redis with a 1-hour TTL.*

### Discover Peers (`GET /peers?agent_name=...`)

**Example Response:**

```json
[
  {
    "agent_name": "example-agent@v0.0.1",
    "peer_id": "Qm...",
    "addresses": ["/ip4/1.2.3.4/tcp/4001"]
  }
]
```

---
