# PersonaAgent

## Purpose & Scope
PersonaAgent is a FastAPI service that generates text (e.g., tweets) in the style of a specified persona using OpenAI, Qdrant vector search, and Redis for persona storage.

## Prerequisites
- Python 3.10+
- Running Redis instance
- Running Qdrant instance
- OpenAI API key
- Dependencies from PyPI (listed in `requirements.txt`)

### Required Environment Variables
- `OPENAI_API_KEY` - For text generation
- `REDIS_URL` - Redis connection string
- `QDRANT_URL` - Qdrant vector database URL
- `QDRANT_API_KEY` - Qdrant API key (if applicable)

## Quickstart
1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables:**
   ```bash
   export OPENAI_API_KEY="your-openai-key"
   export REDIS_URL="redis://localhost:6379"
   export QDRANT_URL="http://localhost:6333"
   ```

3. **Run the agent:**
   ```bash
   serve run persona_agent:app
   ```

4. **Make requests:**
   ```bash
   curl -X POST "http://localhost:8000/{persona_name}" \
   -H "Content-Type: application/json" \
   -d '{"prompt": "your generation prompt"}'
   ```

**The agent will:**
- Verify persona exists in Redis
- Search for similar tweets in Qdrant
- Generate persona-appropriate text using OpenAI
- Return formatted response

# Architecture & Flow

## Overview
PersonaAgent combines vector search (Qdrant), persona storage (Redis), and text generation (OpenAI) to produce persona-specific content. It's deployed as a Ray Serve FastAPI application.

## Component Diagram
See [`persona_agent_diagram`](./images/diagrams/persona_agent.png) showing:
- Client interaction via FastAPI
- Redis for persona metadata storage
- Qdrant for tweet similarity search
- OpenAI for text generation

## Flow Description
1. **Client POSTs** to `/{persona_name}` with a prompt
2. **Redis verification**:
   - Checks if persona exists (`{persona}:description`)
   - Retrieves persona description
3. **Qdrant search**:
   - Generates embedding for input prompt
   - Finds 5 most similar tweets from persona's collection
4. **OpenAI generation**:
   - Builds system message from Jinja2 template
   - Creates generation prompt with persona context
   - Calls OpenAI API with temperature=0.7
5. **Response formatting**:
   - Returns success status and generated text
   - Handles error cases (missing persona, etc.)

# API & Configuration Reference

## REST Endpoints

### `POST /{persona_name}`
Generates text in the specified persona's style.

#### Request Body
```json
{
  "prompt": "your generation instruction",
  "plan": {"optional": "generation plan"}
}
```

#### Responses
**Success (200):**
```json
{
  "success": true,
  "result": "generated text in persona style"
}
```

**Error (400):**
```json
{
  "success": false,
  "result": "error message"
}
```

## Configuration Reference

### Environment Variables
| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |
| `REDIS_URL` | Redis connection URL |
| `QDRANT_URL` | Qdrant server URL |
| `QDRANT_API_KEY` | Qdrant API key (optional) |

### Example Configuration
```bash
export OPENAI_API_KEY="sk-your-key"
export REDIS_URL="redis://user:pass@host:port"
export QDRANT_URL="https://your-qdrant-host"
```

## Data Requirements
1. **Redis** must contain:
   - `{persona_name}:description` - Persona description
2. **Qdrant** must have:
   - Collection matching `persona_name`
   - Tweet embeddings stored with text payloads

# Diagram

![persona_agent.png](images/diagrams/persona_agent.png)

# Example workflow

```
#!/bin/bash
# PersonaAgent - Basic Interaction Examples

# 1. Generate tweet in Elon Musk's persona style
curl -X POST "http://localhost:8000/elon_musk" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a tweet about the future of AI and Mars colonization"}'

# Expected successful response:
# {
#   "success": true,
#   "result": "The future of AI is inevitable, just like our destiny on Mars. Neuralinks will connect human consciousness across planets while Starships carry our physical forms. The age of multiplanetary civilization is coming faster than most think. #AI #Mars"
# }

# 2. Generate tweet in professional CEO persona style
curl -X POST "http://localhost:8000/ceo_tech" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Announce our new quantum computing initiative"}'

# Expected successful response:
# {
#   "success": true,
#   "result": "Thrilled to announce our $50M quantum computing initiative. This breakthrough technology will redefine encryption, drug discovery, and climate modeling. Proud of our team pushing boundaries. The future is quantum. #Innovation #TechLeadership"
# }

# 3. Attempt with non-existent persona
curl -X POST "http://localhost:8000/unknown_persona" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Any prompt"}'

# Expected error response:
# {
#   "success": false,
#   "result": "No persona collection found"
# }

# 4. Generate with additional generation plan
curl -X POST "http://localhost:8000/news_anchor" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Report on the latest blockchain regulation news",
    "plan": {
      "tone": "professional",
      "length": "medium",
      "key_points": ["EU MiCA", "US proposals", "market impact"]
    }
  }'

# Example successful response:
# {
#   "success": true,
#   "result": "Breaking: EU's MiCA regulations set new global standard for crypto oversight while US lawmakers debate their approach. Markets show cautious optimism as clarity emerges. Experts suggest this balanced regulation could attract institutional investment. More details at 9. #CryptoNews #Regulation"
# }```