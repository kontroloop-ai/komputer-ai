
# OfficeMemberResponse


## Properties

Name | Type
------------ | -------------
`lastTaskCostUSD` | string
`name` | string
`role` | string
`taskStatus` | string

## Example

```typescript
import type { OfficeMemberResponse } from '@komputer-ai/sdk'

// TODO: Update the object below with actual values
const example = {
  "lastTaskCostUSD": null,
  "name": null,
  "role": null,
  "taskStatus": null,
} satisfies OfficeMemberResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OfficeMemberResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


