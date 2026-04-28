---
title: Offices
description: Group of agents working under a manager — emerges from manager-worker interactions.
---

A **KomputerOffice** represents a group of agents working together under a manager. When a manager agent creates sub-agents, the system tracks them as an office — providing a single view of the group's progress, active agents, and total cost.

Offices are created automatically when a manager agent creates its first sub-agent. The office status tracks:

- The manager agent and all its members
- Per-member task status and cost
- Aggregate counts (total, active, completed agents)
- Total cost across all members

This is primarily a status/observability resource — you don't create offices directly, they emerge from manager-worker interactions.
