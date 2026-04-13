# @komputer-ai/sdk

TypeScript SDK for the [komputer.ai](https://komputer.ai) platform. Create agents, send tasks, and stream real-time results.

## Installation

```bash
npm install @komputer-ai/sdk
```

## Quick start

```ts
import { KomputerClient } from "@komputer-ai/sdk";

const client = new KomputerClient("http://localhost:8080");

// Create an agent
const agent = await client.createAgent({
  name: "my-agent",
  instructions: "Analyze our Kubernetes cluster",
  model: "claude-sonnet-4-6",
});

// Stream events
for await (const event of await client.watchAgent("my-agent")) {
  if (event.type === "text") console.log(event.payload.content);
  if (event.type === "task_completed") break;
}
```

## Features

- Full REST API coverage: agents, memories, skills, schedules, secrets, connectors, offices, templates
- WebSocket event streaming with automatic history prefetch
- Idempotent create methods (safe to call twice without errors)
- TypeScript types for all request/response models

## API

### Client

```ts
const client = new KomputerClient(baseUrl?: string);
```

### Agents

```ts
await client.createAgent({ name, instructions, model?, ... })
await client.getAgent(name)
await client.listAgents()
await client.patchAgent({ name, instructions?, model?, ... })
await client.deleteAgent(name)
await client.cancelAgentTask(name)
await client.getAgentEvents(name)
const stream = await client.watchAgent(name)  // WebSocket + history
```

### Memories

```ts
await client.createMemory({ name, content, description? })
await client.getMemory(name)
await client.listMemories()
await client.patchMemory({ name, content?, description? })
await client.deleteMemory(name)
```

### Skills

```ts
await client.createSkill({ name, content, description })
await client.getSkill(name)
await client.listSkills()
await client.patchSkill({ name, content?, description? })
await client.deleteSkill(name)
```

### Schedules

```ts
await client.createSchedule({ name, instructions, schedule, ... })
await client.getSchedule(name)
await client.listSchedules()
await client.patchSchedule({ name, schedule? })
await client.deleteSchedule(name)
```

### Secrets

```ts
await client.createSecret({ name, data })
await client.listSecrets()
await client.updateSecret({ name, data })
await client.deleteSecret(name)
```

### Connectors

```ts
await client.createConnector({ name, service, url, ... })
await client.getConnector(name)
await client.listConnectors()
await client.deleteConnector(name)
await client.listConnectorTools(name)
```

### Event streaming

```ts
import { KomputerClient } from "@komputer-ai/sdk";
import type { AgentEvent } from "@komputer-ai/sdk";

const stream = await client.watchAgent("my-agent");

for await (const event of stream) {
  switch (event.type) {
    case "task_started":   // Agent began working
    case "thinking":       // Model is reasoning
    case "text":           // Text output (event.payload.content)
    case "tool_call":      // Tool invocation
    case "tool_result":    // Tool response
    case "task_completed": // Done (event.payload.cost_usd)
    case "error":          // Error occurred
  }
}
```

### Direct API access

For advanced use cases, the underlying generated API clients are available:

```ts
import { AgentsApi, Configuration } from "@komputer-ai/sdk";

const config = new Configuration({ basePath: "http://localhost:8080/api/v1" });
const agents = new AgentsApi(config);
```

## License

MIT
