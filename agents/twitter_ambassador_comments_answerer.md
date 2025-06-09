# Twitter Ambassador Comments Answerer

## Purpose & Scope
TwitterAmbassadorCommentsAnswerer is an autonomous AI agent that strategically engages with Twitter conversations to boost brand visibility. The agent:

1. **Monitors Discussions**  
   - Tracks replies to specified project tweets
   - Identifies relevant conversations using keywords/themes
   - Filters out already-answered comments

2. **Generates Context-Aware Responses**  
   - Uses OpenAI to craft natural-sounding replies
   - Maintains brand voice (positive, constructive, human-like)
   - Strictly follows Twitter character limits

3. **Manages Engagement**  
   - Enforces delays between posts to avoid spam
   - Tracks answered comments in Redis
   - Handles rate limits and API errors gracefully

## Prerequisites

### System Requirements
- Python 3.10+
- Redis 6.2+ (for conversation tracking)
- Ray Serve (for deployment)

### API Keys
- **Twitter API**:
  - Obtain through Twitter Developer Portal
  - Requires OAuth 2.0 with tweet/write permissions

- **OpenAI API**:
  - GPT-4/GPT-3.5 access required
  - Key with at least 100K tokens/month recommended

### Environment Variables
```bash
# Required
export TWITTER_ACCESS_TOKEN="your_twitter_bearer_token"
export OPENAI_API_KEY="sk-your-openai-key"
export REDIS_URL="redis://default:password@localhost:6379"

# Optional (defaults)
export POST_DELAY_SECONDS="60"  # Minimum between replies
export MAX_COMMENT_LENGTH="280" # Twitter character limit
```

## Quickstart

### Local Deployment
```bash
# 1. Install dependencies
poetry install

# 2. Set environment variables
cp .env.example .env
nano .env  # Add your credentials

# 3. Run with Ray Serve
serve run twitter_ambassador_comments_answerer:app
```

### Usage Example
```python
import requests

response = requests.post(
    "http://localhost:8000/nfinify_ai.nfinity_io.web3,ai.decentralization",
    json={
        "plan": {"max_comments": 5}  # Optional parameters
    }
)
```

# Architecture & Flow

## Overview

The `TwitterAmbassadorCommentsAnswerer` is a Ray Serve-based agent that automatically engages with tweet replies on behalf of a specified Twitter account. It uses a goal string to identify target conversations, generates AI-powered responses, and maintains reply history in Redis.

## Component Diagram

See [`twitter_ambassador_comments_answerer_diagram`](./images/diagrams/twitter_ambassador_comments_answerer.png) for the high-level flow including:
- FastAPI + Ray Serve deployment
- External dependencies: Twitter API, OpenAI API, and Redis
- Internal utilities: `twitter_ambassador_utils`, `tweetscout_utils`, and `redis_client`

## Flow Description

1. **User sends POST /{goal} request** to the agent (format: `username.project.keywords.themes`)
2. The agent:
   - Parses the goal into components
   - Authenticates with Twitter using `TwitterAuthClient`
   - Searches for relevant replies using `search_tweets()`
   - Filters out already-answered comments via Redis
   - Uses OpenAI to check if response is needed (`check_answer_is_needed()`)
   - Generates human-like replies (`create_comment_to_comment()`)
   - Posts responses with enforced delays (`ensure_delay_between_posts`)
   - Records answered tweet IDs in Redis

## Key Features
- **Natural Engagement**: AI-generated replies mimic human conversation patterns
- **Duplicate Prevention**: Redis tracks all answered comments
- **Rate Control**: Minimum 60-second delay between replies
- **Safety Checks**: Validates replies for appropriate content before posting

# API Reference

## Core Endpoint

### `POST /{goal}`
Main endpoint for triggering comment engagement workflow.

#### Goal Parameter Structure
```
{your_bot_username}.{target_project}.{keywords}.{themes}
```
Example:  
`nfinify_ai.nfinity_io.web3,defi.decentralization,ai`

#### Request Body (Optional)
```json
{
  "plan": {}
}
```

#### Response Codes
| Code | Description |
|------|-------------|
| 200  | Successfully processed comments |
| 400  | Invalid goal format |
| 401  | Twitter/OpenAI auth failed |
| 429  | Twitter API rate limit hit |
| 500  | Internal processing error |

## Response Format

### Success (200)
```json
{
  "status": "completed",
  "metrics": {
    "scanned_comments": 42,
    "responded_to": 3,
    "skipped_already_answered": 39,
    "time_elapsed": "12.7s"
  },
  "new_comments": [
    {
      "tweet_id": "1786604234150453248",
      "response_text": "Great point about decentralization...",
      "response_url": "https://twitter.com/i/web/status/1786604234150453248"
    }
  ]
}
```

### Error (4xx/5xx)
```json
{
  "error": "TWITTER_AUTH_FAILURE",
  "detail": "Invalid access token",
  "recovery": "Refresh OAuth2 token via Twitter Developer Portal"
}
```

## Underlying API Interactions

### Twitter API Calls
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/2/tweets/search/recent` | Find relevant replies |
| `POST` | `/2/tweets` | Post comment replies |


## Error Handling
The agent provides clear error states:

| Error Case | Response | Resolution |
|------------|----------|------------|
| Invalid goal format | 422 Unprocessable Entity | Use `user.project.keywords.themes` |
| Twitter API limit | 429 Too Many Requests | Wait 15 minutes |
| OpenAI failure | 502 Bad Gateway | Check API key validity |
| Redis unavailble | 503 Service Unavailable | Verify Redis connection |


## Rate Limits
- **Twitter**: 50 requests/15 minutes (per token)
- **OpenAI**: 3,500 RPM / 90,000 TPM
- **Redis**: 10,000 writes/second

# Diagram

![twitter_ambassador_comments_answerer.png](images/diagrams/twitter_ambassador_comments_answerer.png)

# Example workflow

```
#!/bin/bash
# TwitterAmbassadorCommentsAnswerer - Basic Interaction Examples

# 1. Engage with project comments
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"goal":"your_bot.nfinity_io.web3,ai.decentralization"}' \
  http://localhost:8000/

# Expected response format:
# {
#   "status": "engaged",
#   "comments_processed": 5,
#   "replies_posted": 2,
#   "new_comment_ids": ["1786604234150453248", "1786604234150453249"],
#   "content_samples": [
#     "Great point about decentralization - the NFINITY protocol actually...",
#     "The AI components you mentioned are handled by our..."
#   ]
# }
```