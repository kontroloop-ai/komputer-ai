---
title: Error handling
description: HTTP status codes returned by the komputer-api and the standard error response format.
---

| HTTP Code | Meaning |
|-----------|---------|
| `201` | Agent created successfully |
| `200` | Task forwarded to existing agent / successful read |
| `400` | Bad request (missing fields, invalid role) |
| `404` | Agent not found |
| `409` | Agent is busy or has no running pod yet |
| `500` | Internal error (cluster issue, pod unreachable) |

All error responses follow this format:

```json
{"error": "description of what went wrong"}
```
