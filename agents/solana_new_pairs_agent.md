# Solana New Pairs Tracking Bot

## Purpose & Scope
The SolanaNewPairsBot is an automated monitoring system designed to:

- Continuously scan for newly created token pairs on Solana DEXs
- Identify and analyze promising new trading opportunities
- Automatically publish findings to Telegram channels
- Provide real-time alerts and analytics

Key capabilities:
- Integration with Dextools API for comprehensive pair data
- SQL database storage for historical analysis
- Intelligent filtering of low-quality pairs
- Customizable alert templates

## Prerequisites

### Infrastructure Requirements
- **Solana RPC Node**: Mainnet endpoint (public or private)
- **PostgreSQL**: Version 12+ for data storage
- **Redis**: Optional for caching and queue management

### API Keys
| Service | Environment Variable | Example Value |
|---------|----------------------|---------------|
| Dextools | `DEXTOOLS_API_KEY` | `dt_xyz123...` |
| Telegram | `TG_BOT_TOKEN` | `123456:ABC...` |
| Solana | `SOLANA_RPC_URL` | `https://api.mainnet-beta.solana.com` |

### Python Requirements
- Python 3.10+ with virtualenv
- Core packages:
  ```text
  telethon==1.28.0
  sqlalchemy==2.0.0
  ray[serve]==2.5.0
  httpx==0.24.0
  ```

## Quickstart Guide

1. **Initial Setup**
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Configuration**
```bash
# Required variables
export DEXTOOLS_API_KEY="your_api_key_here"
export TG_BOT_TOKEN="123456:ABC..."
export SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"

# Optional variables
export DB_URL="postgresql://user:pass@localhost:5432/solana_pairs"
export TG_CHANNEL_ID="@your_channel"
```

3. **Service Initialization**
```bash
# Start Ray cluster
ray start --head --port=6379

# Launch the agent
python -m solana_new_pairs_bot &> bot.log &
```

4. **Verification**
```bash
# Check service health
curl http://localhost:8000/health

# View active tasks
ray status
```

# Architecture & Flow

## Overview
The SolanaNewPairsBot is a distributed system that monitors Solana DEXs for new token pairs. It combines real-time data collection with automated alerting through Telegram, built on Ray Serve for horizontal scalability.

## Component Diagram
See [`solana_new_pairs_agent`](./images/diagrams/solana_new_pairs_agent.png) for visualization of:

- Dextools API integration
- Solana RPC connections  
- PostgreSQL data storage
- Telegram bot messaging
- Ray Serve deployment topology

## Flow Description

### Data Collection Process
1. **Polling** (every 10 seconds):
   ```python
   while True:
       new_pairs = dextools.fetch_new_pairs()
       await process_pairs(new_pairs)
       await asyncio.sleep(10)
   ```
2. **Validation**:
   - Liquidity > $2,000
   - Contract verified
   - Not in blacklist
   - Age < 30 minutes

3. **Storage**:
   - Postgres schema includes:
     ```sql
     CREATE TABLE pairs (
         id SERIAL PRIMARY KEY,
         token_address VARCHAR(44) UNIQUE,
         pool_address VARCHAR(44),
         liquidity NUMERIC,
         detected_at TIMESTAMPTZ
     );
     ```

### Alert Generation
1. **Template Processing**:
   ```jinja2
   🚨 New {{ network }} Pair
   • Token: {{ token_address|truncate(6) }}
   • Liquidity: ${{ liquidity|thousands }}
   • 🔗 Trade: [Raydium]({{ raydium_link }})
   ```

2. **Rate Limiting**:
   - 3 messages/minute burst
   - 20 messages/hour sustained

### Failure Recovery
- **Database Outages**:
  ```python
  async def save_pair(pair):
      try:
          await db.insert(pair)
      except Exception:
          await redis.rpush('pending_pairs', pair)
  ```
- **Telegram Errors**:
  - Exponential backoff from 5s to 1h
  - Dead letter queue after 3 attempts

## Sequence Diagram
```plaintext
Dextools → Scanner → Validator → DB → Notifier → Telegram
     ↑----------- Retry Loop ------------↓
```

Key aspects matching your reference:
1. **Structured sections** (Overview, Diagram, Flow)
2. **Code snippets** showing critical logic
3. **Database schema** example
4. **Failure handling** details
5. **Plaintext diagram** alternative
6. **Technology specifics** without oversharing
7. **Architecture decisions** justification

# API Reference

## Core Endpoints

### `POST /{command}`
Triggers specific bot operations. The following commands are supported:

| Command | Description | Parameters |
|---------|-------------|------------|
| `scan` | Force immediate chain scan | `{"interval": "5m", "chains": ["solana"]}` |
| `post` | Manual Telegram posting | `{"test_mode": true}` |
| `stats` | Generate market statistics | `{"timeframe": "24h"}` |

**Example Request:**
```bash
curl -X POST http://localhost:8000/scan \
  -H "Content-Type: application/json" \
  -d '{"interval": "10m", "priority": "high"}'
```

**Response Schema:**
```json
{
  "status": "success|error",
  "data": {
    "new_pairs": 5,
    "posted_alerts": 3,
    "scan_duration": "12.7s"
  },
  "timestamp": "2023-11-15T14:32:10Z"
}
```

## Data Collection API

### Dextools Integration
```yaml
base_url: https://api.dextools.io/v1
endpoints:
  new_pairs: /pairs/solana/new
  pair_details: /pair/solana/{address}
rate_limit: 10 requests/minute
```

### Solana RPC Methods
Required methods:
- `getProgramAccounts` (Token Program)
- `getAccountInfo`
- `getTransaction`

## Alert Configuration

### Telegram Post Template
```jinja
🚀 *New {{ network }} Pair Detected!*

• Token: `{{ token_address }}`
• Pool: `{{ pool_address }}`
• Liquidity: ${{ liquidity|format_number }}
• Age: {{ age }} minutes

{% if is_verified %}✅ Verified Project{% endif %}
```

### Filtering Rules
```python
MIN_LIQUIDITY = 2000  # USD
MAX_AGE = 30  # minutes
BLACKLIST = ["0x123...def"]  # scam tokens
```


### Key Features:
1. **Command-Specific Documentation** - Clear table of available commands
2. **Live Examples** - Ready-to-use cURL commands
3. **Response Schema** - Detailed output structure
4. **Integration Specs** - API rate limits and endpoints
5. **Template Examples** - Customizable alert formats

### Usage Notes:
- All endpoints require `Content-Type: application/json`
- Error responses include `retry-after` header when rate-limited
- Commands are queued and processed asynchronously

# Diagram

![solana_new_pairs_agent.png](images/diagrams/solana_new_pairs_agent.png)

# Example workflow

```
#!/bin/bash
# SolanaNewPairsBot - Interaction Examples

# 1. Check service status
curl -s http://localhost:8000/status

# 2. Trigger manual collection (example goal)
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"plan":{"interval":"30s"}}' \
  http://localhost:8000/monitor

# Expected response:
# {"status":"main запущен"}

# 3. Sample Telegram post format
echo '🚀 New SOL Pair: 
Token: 7vf...CxR 
Pool: 5Zg...Q2w 
Liquidity: $12,450'
```