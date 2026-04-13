
# CreateAgentRequest


## Properties

Name | Type
------------ | -------------
`connectors` | Array&lt;string&gt;
`instructions` | string
`lifecycle` | string
`memories` | Array&lt;string&gt;
`model` | string
`name` | string
`namespace` | string
`officeManager` | string
`role` | string
`secretRefs` | Array&lt;string&gt;
`skills` | Array&lt;string&gt;
`systemPrompt` | string
`templateRef` | string

## Example

```typescript
import type { CreateAgentRequest } from '@komputer-ai/sdk'

// TODO: Update the object below with actual values
const example = {
  "connectors": null,
  "instructions": null,
  "lifecycle": null,
  "memories": null,
  "model": null,
  "name": null,
  "namespace": null,
  "officeManager": null,
  "role": null,
  "secretRefs": null,
  "skills": null,
  "systemPrompt": null,
  "templateRef": null,
} satisfies CreateAgentRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateAgentRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


