# komputer-ai SDK

Auto-generated client libraries for the komputer.ai REST API.

## Python

```bash
pip install komputer-ai    # or: cd komputer-sdk/python && pip install -e .
```

```python
from komputer_ai.client import KomputerClient

client = KomputerClient("http://localhost:8080")

# Create an agent
client.create_agent(
    name="my-agent",
    instructions="Analyze our Kubernetes cluster",
    model="claude-sonnet-4-6",
)

# Stream events as the agent works
for event in client.watch_agent("my-agent"):
    if event.type == "text":
        print(event.payload.get("content", ""))
    elif event.type == "task_completed":
        break

# Attach a memory
client.create_memory(name="context", content="We run a 50-node GKE cluster.")
client.patch_agent("my-agent", memories=["context"])
```

## TypeScript

```bash
cd komputer-sdk/typescript && npm install && npm run build
```

```typescript
import { KomputerClient } from "komputer-ai";

const client = new KomputerClient("http://localhost:8080");

// Create an agent
const agent = await client.createAgent({
  name: "my-agent",
  instructions: "Analyze our Kubernetes cluster",
  model: "claude-sonnet-4-6",
});

// Attach a memory and skill
await client.createMemory({ name: "context", content: "We run a 50-node GKE cluster." });
await client.patchAgent({ name: "my-agent", memories: ["context"] });

// List and clean up
const agents = await client.listAgents();
await client.deleteAgent("my-agent");
```

## Go

```bash
go get github.com/kontroloop-ai/komputer-ai/komputer-sdk/go/client
```

```go
package main

import (
    "context"
    "fmt"

    client "github.com/kontroloop-ai/komputer-ai/komputer-sdk/go/client"
    komputer "github.com/kontroloop-ai/komputer-ai/komputer-sdk/go/komputer"
)

func main() {
    c := client.New("http://localhost:8080")
    ctx := context.Background()

    // Create an agent
    agent, _, _ := c.CreateAgent(ctx, "my-agent", "Analyze our cluster",
        client.CreateAgentOpts{Model: komputer.PtrString("claude-sonnet-4-6")})
    fmt.Println(agent.Name)

    // Attach a memory
    c.CreateMemory(ctx, "context", "We run a 50-node GKE cluster.")
    c.PatchAgent(ctx, "my-agent",
        client.PatchAgentOpts{Memories: []string{"context"}})

    // List and clean up
    agents, _, _ := c.ListAgents(ctx)
    fmt.Println(len(agents.Agents))
    c.DeleteAgent(ctx, "my-agent")
}
```

All methods accept flat parameters — no model objects needed. For advanced use cases, the generated API clients are available via `client.agents` (Python), `client._agents` (TypeScript), or `client.api` (Go).

## Regenerating

When the API changes, regenerate the SDKs:

```bash
cd komputer-sdk

# Regenerate all SDKs
make all

# Or one at a time
make python
make go
make typescript

# Regenerate just the client wrappers (no spec regeneration)
make client

# Just regenerate the OpenAPI spec
make spec
```

### Prerequisites

- [swag](https://github.com/swaggo/swag) — `go install github.com/swaggo/swag/cmd/swag@v1.16.6`
- [openapi-generator-cli](https://openapi-generator.tech/) — via `npx` (included in the Makefile)
- Node.js + npx
- Python 3.10+ (for `generate_client.py`)
- Go 1.23+

## Testing

```bash
cd komputer-sdk

# Python unit tests
make test

# Python integration tests (requires a running komputer-ai instance)
KOMPUTER_API_URL=http://localhost:8080 make test-integration

# Go tests
cd go/client && go test ./...

# TypeScript tests
cd typescript && npx vitest run
```

Integration tests create and delete real resources prefixed with `sdk-test-`. They clean up after themselves.

## Structure

```
komputer-sdk/
├── Makefile              # Generation pipeline
├── generate_client.py    # Generates convenience wrappers for all languages
├── openapi.yaml          # Generated OpenAPI 3.0 spec
├── python/
│   ├── komputer_ai/
│   │   ├── client.py         # Auto-generated convenience client
│   │   ├── api/              # Generated API classes
│   │   │   └── agents_ws.py  # WebSocket streaming (hand-written)
│   │   └── models/           # Generated request/response models
│   └── tests/
├── go/
│   ├── client/
│   │   ├── client.go         # Auto-generated convenience client
│   │   └── client_test.go
│   └── komputer/             # Generated Go API package
├── typescript/
│   └── src/
│       ├── client.ts         # Auto-generated convenience client
│       ├── client.test.ts
│       ├── apis/             # Generated API classes
│       └── models/           # Generated request/response models
```
