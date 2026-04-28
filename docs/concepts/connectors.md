---
title: Connectors
description: Named MCP server connections that give agents access to external tools and data sources.
---

A **KomputerConnector** is a named MCP (Model Context Protocol) server connection. Connectors give agents access to external tools and data sources — GitHub repositories, Slack channels, Linear issues, and any service that exposes an MCP endpoint.

## When to use it

- **External integrations** — Let agents read and write to services like GitHub, Slack, or Linear without writing custom tools
- **Custom MCP servers** — Point to any MCP-compatible endpoint, self-hosted or remote
- **Shared credentials** — One connector definition can be attached to many agents; credentials are stored once as a K8s Secret

## How it works

1. Create a `KomputerConnector` CR with a URL and an optional auth secret reference
2. The UI can auto-create the K8s Secret from a token you paste in — you never handle the secret directly
3. Reference the connector by name in `spec.connectors` on a `KomputerAgent`
4. When the agent pod starts, the operator injects the MCP server config as `KOMPUTER_MCP_SERVERS` and mounts the auth token as a `CONNECTOR_<NAME>_TOKEN` env var
5. The agent runtime configures the Claude SDK with the MCP server, making all its tools available as `mcp__<name>__*` slash commands
6. If you attach or remove a connector from a **running** agent via PATCH, the change takes effect on the next task — no pod restart needed
7. The `.status.attachedAgents` field tracks how many agents reference each connector

## Example

```yaml
apiVersion: komputer.komputer.ai/v1alpha1
kind: KomputerConnector
metadata:
  name: github
  namespace: default
spec:
  service: github
  url: "https://api.githubcopilot.com/mcp/"
  authSecretKeyRef:
    name: github-credentials
    key: token
```

Attach to an agent:
```yaml
spec:
  connectors:
    - github
```

The agent can then use tools like `mcp__github__create_pull_request`, `mcp__github__search_code`, etc.

## Compatibility

Which third-party services work as connectors today, which need OAuth, and which require running your own MCP server.

### Supported out of the box

These services work with a static token. Paste it into the connector dialog and you're done.

| Service | MCP URL | Token type |
|---------|---------|------------|
| GitHub | `https://api.githubcopilot.com/mcp/` | Personal Access Token (`ghp_`) |
| Gmail | `https://mcp.google.com/a/gmail/mcp` | Google OAuth Access Token (`ya29.`) |
| Google Calendar | `https://mcp.google.com/a/calendar/mcp` | Google OAuth Access Token (`ya29.`) |
| Linear | `https://mcp.linear.app/mcp` | API Key (`lin_api_`) |
| Slack | `https://mcp.slack.com/mcp` | User OAuth Token (`xoxp-`) |

> **Note:** Gmail and Google Calendar tokens are OAuth access tokens, but you can grab one manually via the [OAuth Playground](https://developers.google.com/oauthplayground) — no full OAuth flow needed in the komputer.ai UI.

### Requires a full OAuth flow

These services reject static tokens — you need to run them through OAuth 2.0 to get a usable access token. The current UI doesn't support this yet.

| Service | MCP URL | Why static tokens don't work |
|---------|---------|------------------------------|
| Notion | `https://mcp.notion.com/mcp` | Integration tokens (`ntn_`) are rejected with `invalid_token` — only OAuth 2.0 access tokens are accepted |
| Atlassian (Rovo) | `https://mcp.atlassian.com/v1/mcp` | PAT tokens only expose 2 limited tools (`getTeamworkGraphContext`, `getTeamworkGraphObject`) — full Jira/Confluence access requires OAuth |

### Requires a self-hosted MCP server

These services don't expose a remote MCP endpoint that fits our model. To use them, deploy an MCP server inside your cluster and point a custom connector at it.

| Service | Recommended server | Notes |
|---------|--------------------|-------|
| Atlassian (full Jira + Confluence) | [`sooperset/mcp-atlassian`](https://github.com/sooperset/mcp-atlassian) | Exposes ~72 Jira + Confluence tools via PAT — deploy in cluster, point custom connector at pod URL |
| Notion (full) | [`modelcontextprotocol/servers/notion`](https://github.com/modelcontextprotocol/servers/tree/main/src/notion) | Accepts `ntn_` integration tokens — deploy in cluster |

### Adding your own

Any MCP-compatible endpoint can be added as a custom connector — just create a `KomputerConnector` pointing at the URL and (optionally) referencing an auth secret. See the example above.
