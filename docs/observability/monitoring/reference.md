---
title: Metric reference
description: Complete list of metrics exposed by every komputer-ai component.
---

## API plumbing (`/api/metrics`)

- `komputer_api_http_requests_total{method,path,status}` (counter)
- `komputer_api_http_request_duration_seconds{method,path}` (histogram)
- `komputer_api_ws_connections_active{mode}` (gauge — `mode=broadcast|group`)
- `komputer_api_ws_dispatch_total{mode,result}` (counter — `result=delivered|claimed_by_other|write_failed`)
- `komputer_api_redis_xread_messages_total` (counter)
- `komputer_api_build_info{version,commit}` (gauge — always 1)

## Agent business (`/agent/metrics`)

- `komputer_agent_tasks_total{namespace,model,outcome,agent_name}` (counter — `outcome=started|completed|cancelled|errored`)
- `komputer_agent_task_duration_seconds{namespace,model,agent_name}` (histogram)
- `komputer_agent_task_cost_usd_total{namespace,model,agent_name}` (counter)
- `komputer_agent_task_tokens_total{namespace,model,kind,agent_name}` (counter — `kind=input|output|cache_read|cache_creation`)
- `komputer_agent_tool_invocations_total{namespace,tool,outcome,agent_name}` (counter)
- `komputer_agent_tool_duration_seconds{namespace,tool,agent_name}` (histogram)
- `komputer_agent_actions_total{action,result}` (counter — `action=create|delete|cancel|sleep|wake|patch`)
- `komputer_tasks_inprogress{namespace,model,agent_name}` (gauge — listed from K8s at scrape time)
- `komputer_schedules_active{namespace}` (gauge — listed from K8s at scrape time)
- `komputer_agents_active{namespace,phase}` (gauge — listed from K8s at scrape time)
- `komputer_agent_build_info{version,commit}` (gauge — always 1)

## Operator (`/metrics`)

- `controller_runtime_reconcile_total{controller,result}` (counter)
- `controller_runtime_reconcile_time_seconds{controller}` (histogram)
- `controller_runtime_active_workers{controller}` (gauge)
- `komputer_operator_template_cap_reached_total{namespace,template}` (counter)

## Agent push (`/metrics` on agent pod, plus remote-write)

- `komputer_agent_steering_total{agent_name}` (counter)
- `komputer_agent_mcp_connector_status{agent_name,connector,status}` (gauge — 1 healthy, 0 unhealthy)
- `komputer_agent_subagent_wait_seconds{agent_name}` (histogram)
