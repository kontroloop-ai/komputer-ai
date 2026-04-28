---
title: WebSocket events
description: Real-time event streaming — broadcast and consumer-group delivery modes for distributed deployments.
---

Connect to stream events as the agent works:

```
ws://localhost:8080/api/v1/agents/:name/ws
```

The connection stays open until you disconnect. Events arrive as JSON lines.

## Delivery modes: broadcast vs. consumer group

The WebSocket endpoint supports two delivery modes via the optional `?group=<name>` query parameter:

| Mode | URL | Behavior | When to use |
|------|-----|----------|-------------|
| **Broadcast** (default) | `/api/v1/agents/:name/ws` | Every connected client receives every event. | UIs, dashboards, debugging — any consumer where seeing the same event multiple times across separate connections is fine or desired. |
| **Consumer group** | `/api/v1/agents/:name/ws?group=my-app` | Each event in the stream is delivered to **exactly one** client per group, across all API replicas. | Distributed systems with multiple service instances watching the same agent — e.g. a Slack bot or webhook forwarder running 3 replicas, where only one replica should react per event. |

**Why this matters in distributed deployments.** Without a `group`, two replicas of your service connecting to the same agent will each receive every event independently — you'll process every message twice. With `?group=my-bot`, the API uses Redis-coordinated routing to pick one connected client per event, so duplicate processing is eliminated regardless of how many replicas you run.

**Group semantics:**
- The group name is opaque — pick anything (`my-app`, `slack-bot-prod`, `audit-pipeline`).
- Group membership is per-agent: `?group=my-app` on agent `A` is independent of `?group=my-app` on agent `B`.
- Routing is best-effort with intra-replica retry: if the chosen client's WebSocket fails mid-write, the API tries the next group member on the same replica before giving up. The event is only lost for the group if **all** group members on the routing replica fail simultaneously (or no group members are connected to the replica that won the claim). For strict exactly-once processing, use the `/events` REST endpoint on reconnect to backfill any missed events.
- A group with one connected client behaves identically to broadcast.
- Mixing modes works: ungrouped clients still get every event; grouped clients share within their group.

## Sample events

```json
{"agentName":"my-agent","namespace":"production","type":"task_started","timestamp":"2026-03-27T10:00:01Z","payload":{"instructions":"Analyze the latest sales data..."}}
{"agentName":"my-agent","namespace":"production","type":"thinking","timestamp":"2026-03-27T10:00:02Z","payload":{"content":"I need to look at the sales data..."}}
{"agentName":"my-agent","namespace":"production","type":"tool_call","timestamp":"2026-03-27T10:00:03Z","payload":{"id":"tc_01","tool":"Bash","input":{"command":"python analyze.py"}}}
{"agentName":"my-agent","namespace":"production","type":"tool_result","timestamp":"2026-03-27T10:00:05Z","payload":{"tool":"Bash","output":"Total revenue: $1.2M..."}}
{"agentName":"my-agent","namespace":"production","type":"text","timestamp":"2026-03-27T10:00:06Z","payload":{"content":"Based on the analysis, here is the summary report..."}}
{"agentName":"my-agent","namespace":"production","type":"task_completed","timestamp":"2026-03-27T10:00:07Z","payload":{"result":"...","cost_usd":0.08,"duration_ms":6000,"turns":2}}
```

## Event Types

| Type | Description | Key Payload Fields |
|------|-------------|-------------------|
| `task_started` | Agent begins working | `instructions` |
| `thinking` | Claude's internal reasoning | `content` |
| `tool_call` | Tool invocation (Bash, WebSearch, etc.) | `id`, `tool`, `input` |
| `tool_result` | Tool execution output | `tool`, `output` |
| `text` | Claude's text response | `content` |
| `task_completed` | Task finished successfully | `result`, `cost_usd`, `duration_ms`, `turns`, `stop_reason`, `session_id` |
| `task_cancelled` | Task was cancelled | `reason` |
| `error` | Error occurred | `error` |

## Cost and Usage Tracking

Every `task_completed` event includes usage metrics that your system should collect:

```json
{
  "type": "task_completed",
  "payload": {
    "result": "Here is the summary report...",
    "cost_usd": 0.08,
    "duration_ms": 6000,
    "turns": 2,
    "stop_reason": "end_turn",
    "session_id": "sess_01abc..."
  }
}
```

| Field | Description |
|-------|-------------|
| `cost_usd` | Total Anthropic API cost for this task (input + output tokens) |
| `duration_ms` | Wall-clock time from task start to completion |
| `turns` | Number of agent turns (a turn = one Claude request/response cycle, including tool use) |
| `stop_reason` | Why the agent stopped (`end_turn`, `max_tokens`, etc.) |
| `session_id` | Claude session ID — the same agent reuses this across tasks for conversation continuity |

**komputer.ai does not aggregate or store these metrics.** Your system is responsible for collecting them from the WebSocket stream (or the `/events` endpoint) and building whatever analytics you need. Common use cases:

- **Cost dashboards** — track spend per agent, namespace, team, or time period
- **Budgeting and alerts** — set cost thresholds per namespace and alert when exceeded
- **Performance tracking** — monitor task duration and turn count to detect regressions or inefficient prompts
- **Chargeback / billing** — attribute costs to internal teams or external customers
- **Capacity planning** — correlate agent usage patterns with cluster resource consumption

A minimal collector looks like this:

```python
# Collect cost data from the WebSocket stream
ws = websocket.WebSocket()
ws.connect(f"ws://localhost:8080/api/v1/agents/{agent_name}/ws")

for msg in ws:
    event = json.loads(msg)
    if event["type"] == "task_completed":
        payload = event["payload"]
        db.insert({
            "agent": event["agentName"],
            "namespace": event["namespace"],
            "timestamp": event["timestamp"],
            "cost_usd": payload["cost_usd"],
            "duration_ms": payload["duration_ms"],
            "turns": payload["turns"],
        })
```
