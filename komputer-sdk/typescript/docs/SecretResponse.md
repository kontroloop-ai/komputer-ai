
# SecretResponse


## Properties

Name | Type
------------ | -------------
`agentName` | string
`agentNames` | Array&lt;string&gt;
`attachedAgents` | number
`createdAt` | string
`keys` | Array&lt;string&gt;
`managed` | boolean
`name` | string
`namespace` | string

## Example

```typescript
import type { SecretResponse } from '@komputer-ai/sdk'

// TODO: Update the object below with actual values
const example = {
  "agentName": null,
  "agentNames": null,
  "attachedAgents": null,
  "createdAt": null,
  "keys": null,
  "managed": null,
  "name": null,
  "namespace": null,
} satisfies SecretResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SecretResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


