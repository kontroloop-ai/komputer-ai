
# CreateScheduleAgentSpec


## Properties

Name | Type
------------ | -------------
`lifecycle` | string
`model` | string
`role` | string
`secretRefs` | Array&lt;string&gt;
`templateRef` | string

## Example

```typescript
import type { CreateScheduleAgentSpec } from '@komputer-ai/sdk'

// TODO: Update the object below with actual values
const example = {
  "lifecycle": null,
  "model": null,
  "role": null,
  "secretRefs": null,
  "templateRef": null,
} satisfies CreateScheduleAgentSpec

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateScheduleAgentSpec
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


