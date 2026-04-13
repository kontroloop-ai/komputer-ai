
# OfficeResponse


## Properties

Name | Type
------------ | -------------
`activeAgents` | number
`completedAgents` | number
`createdAt` | string
`manager` | string
`members` | [Array&lt;OfficeMemberResponse&gt;](OfficeMemberResponse.md)
`name` | string
`namespace` | string
`phase` | string
`totalAgents` | number
`totalCostUSD` | string
`totalTokens` | number

## Example

```typescript
import type { OfficeResponse } from 'komputer-ai'

// TODO: Update the object below with actual values
const example = {
  "activeAgents": null,
  "completedAgents": null,
  "createdAt": null,
  "manager": null,
  "members": null,
  "name": null,
  "namespace": null,
  "phase": null,
  "totalAgents": null,
  "totalCostUSD": null,
  "totalTokens": null,
} satisfies OfficeResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OfficeResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


