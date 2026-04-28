# 08 — Python Integration

Create an agent and stream its events in real time using the official komputer.ai Python SDK.

## What it does

A standalone Python script that:
1. Creates a komputer.ai agent via the SDK
2. Streams its events in real time via WebSocket
3. Prints each event type as it arrives
4. Exits cleanly when the task completes

## Install the SDK

```bash
pip install komputer-ai-sdk
```

## Run it

```bash
# Make sure komputer-api is accessible
python client.py
```

## Event handling

The script handles all event types:

| Event | Action |
|-------|--------|
| `task_started` | Print the instructions |
| `thinking` | Print truncated thinking content |
| `tool_call` | Print tool name + input summary |
| `text` | Print the full response text |
| `task_completed` | Print cost/duration/turns, then exit |
| `error` | Print error, then exit |

## Adapting for production

Store the result and handle multiple agents:

```python
from komputer_ai.client import KomputerClient

with KomputerClient("http://localhost:8080") as client:
    client.create_agent(name="analyst", instructions="Analyze the logs for anomalies")

    result = {}
    for event in client.watch_agent("analyst"):
        if event.type == "task_completed":
            result = event.payload
            # Store in your database
            db.insert_task_result("analyst", result)
            break
```

## Key concepts

- **`KomputerClient`** — the high-level SDK client; supports context manager (`with`) for automatic cleanup
- **`client.create_agent()`** — creates the agent or re-tasks it if it already exists (handles 409 automatically)
- **`client.watch_agent()`** — returns an event stream that prefetches history from Redis before opening the WebSocket, so you never miss events that fired between create and connect
- **`task_completed` or `error`** — always break on these; the stream stays open otherwise
- See the [Integration Guide](../../docs/integration/) for all API endpoints and event types
- See [komputer-sdk/](../../komputer-sdk/) for Go and TypeScript SDK equivalents
