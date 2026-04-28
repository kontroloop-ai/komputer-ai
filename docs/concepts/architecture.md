---
title: Architecture
description: Kubernetes as the database — stateless API, operator reconciliation, Redis as transport.
---

komputer.ai is stateless — it has no external database. All system state is stored as Kubernetes Custom Resources (CRs) in etcd, the cluster's built-in key-value store. Agents, templates, and config are all CRs. Agent status, task progress, session IDs, and pod references are all persisted as CR status fields.

This means the Kubernetes API server is the source of truth. The operator watches CRs and reconciles them into pods and volumes. The API server reads and patches CRs to reflect task status. If the operator or API restarts, they simply re-read the CRs and resume — there's nothing else to recover.

Redis is used only as a transient event bus for real-time streaming, not as persistent storage.

## How it all fits together

```
KomputerConfig (cluster)
    │
    ├── Redis connection settings
    └── API URL for manager agents

KomputerAgentClusterTemplate (cluster)
    │
    └── Default pod spec, image, resources, storage
         │
         └── overridden by ──▶ KomputerAgentTemplate (per namespace)

KomputerMemory (per namespace)          KomputerSkill (per namespace)
    │                                       │
    └── content injected into system prompt └── written as skill file to agent fs

KomputerConnector (per namespace)
    │
    └── MCP server URL + auth secret → injected as env vars into agent pod

KomputerAgent (per namespace)
    │
    ├── references ──▶ Template (by name)
    ├── references ──▶ KomputerMemory names (injected into system prompt)
    ├── references ──▶ KomputerSkill names (written as skill files)
    ├── references ──▶ KomputerConnector names (MCP servers injected at pod start)
    ├── owns ──▶ Pod, PVC, ConfigMap, Secrets
    ├── lifecycle ──▶ Default (running) / Sleep (PVC only) / AutoDelete
    ├── role: manager ──▶ gets MCP tools to create sub-agents
    │                      └── creates ──▶ KomputerOffice (tracks the group)
    └── role: worker ──▶ gets bash + web search only

KomputerSchedule (per namespace)
    │
    ├── cron expression + timezone
    └── creates/triggers ──▶ KomputerAgent on schedule
```

## The typical flow

1. Platform admin sets up **KomputerConfig** (Redis, API URL) and a **KomputerAgentClusterTemplate** (default pod configuration)
2. External system creates a **KomputerAgent** via the API, optionally with secrets and a lifecycle mode
3. The operator resolves the template, creates a pod and workspace, and starts the agent
4. The agent executes the task, streaming events through Redis to the API
5. The external system consumes events via WebSocket (broadcast or `?group=` consumer group for distributed deployments — see [WebSocket events](../integration/websocket)) or polls the events endpoint
6. Based on lifecycle: agent stays alive (default), sleeps (pod deleted, PVC kept), or auto-deletes
