# komputer-ai Architecture Rules

## 1. Thin Agent

The `komputer-agent` (Python) should contain minimal logic — just enough to run the Claude SDK and publish events to Redis. All business logic, state management, and orchestration belongs in `komputer-api` or `komputer-operator`.

When adding features, default to implementing in the API or operator. Only add code to the agent if it requires in-pod execution (Claude SDK interaction, workspace filesystem access).

## 2. CR Status as Database

`KomputerAgentStatus` is the single source of truth for agent state. Treat `.status` fields as a database — read from them for queries, write to them for state changes. No separate database.

To persist new agent state: add a field to `KomputerAgentStatus` in `komputer-operator/api/v1alpha1/komputeragent_types.go` and regenerate the CRD.

## 3. Redis is Just a Queue

Redis is exclusively a message transport (streams) for forwarding events from the agent to the API worker. It is NOT a data store, cache, or source of truth.

- Agent publishes events via `XADD` to Redis streams
- API worker consumes via `XREAD`, then writes state to the CR status
- Do not add Redis keys for storing state, config, or lookups
- `komputer-history:*` lists are for real-time WebSocket replay only, not a queryable store

## 4. CR Status Field Ownership

Each status field has exactly one writer. No component writes fields it doesn't own.

| Owner | Fields |
|-------|--------|
| **Operator** | Phase, PodName, PvcName, StartTime, CompletionTime, Message |
| **API worker** | TaskStatus, LastTaskMessage, SessionID, LastTaskCostUSD, TotalCostUSD |

When adding new status fields, decide the owner upfront and document it in the field comment.
