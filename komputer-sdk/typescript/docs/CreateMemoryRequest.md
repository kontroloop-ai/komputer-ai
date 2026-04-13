
# CreateMemoryRequest


## Properties

Name | Type
------------ | -------------
`content` | string
`description` | string
`name` | string
`namespace` | string

## Example

```typescript
import type { CreateMemoryRequest } from '@komputer-ai/sdk'

// TODO: Update the object below with actual values
const example = {
  "content": null,
  "description": null,
  "name": null,
  "namespace": null,
} satisfies CreateMemoryRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateMemoryRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


