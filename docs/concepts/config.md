---
title: Config
description: Cluster-scoped singleton that holds platform-wide settings.
---

**KomputerConfig** is a cluster-scoped singleton that holds platform-wide settings:

- **Redis connection** — Address, database number, stream prefix, and optional password secret. Redis is the event bus that connects agents to the API.
- **API URL** — The internal cluster URL of the komputer-api service. Manager agents use this to create and manage sub-agents via HTTP.

The operator auto-discovers this resource — agents and templates don't need to reference it explicitly.
