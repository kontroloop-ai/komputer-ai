# 08 — Python Integration

Create an agent and stream its events in real time from a Python script using `httpx` and `websockets`.

## What it does

A standalone Python script that:
1. Creates a komputer.ai agent via the HTTP API
2. Connects to the WebSocket stream immediately
3. Prints each event type as it arrives
4. Exits cleanly when the task completes

## Install dependencies

```bash
pip install httpx websockets
```

## Run it

```bash
# Make sure komputer-api is accessible
export KOMPUTER_API=http://localhost:8080

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

For production use, store the result and handle retries:

```python
async def run_agent(name: str, instructions: str) -> dict:
    # ... create agent ...
    
    result = {}
    async with websockets.connect(uri, ping_interval=30) as ws:
        async for raw in ws:
            event = json.loads(raw)
            if event["type"] == "task_completed":
                result = event["payload"]
                # Store in your database
                await db.insert_task_result(name, result)
                break
    return result
```

## Key concepts

- **Create first, then WebSocket** — create the agent via HTTP, then immediately open the WS connection. The stream replays recent events from Redis so you won't miss events that fired between create and connect.
- **Async WebSocket** — use `asyncio` + `websockets` for non-blocking event streaming
- **`task_completed` or `error`** — always exit the loop on these two events; the connection stays open otherwise
- See the [Integration Guide](../../docs/integration-guide.md) for all API endpoints and event types
