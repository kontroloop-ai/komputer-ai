# AgentListResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Agents** | Pointer to [**[]AgentResponse**](AgentResponse.md) |  | [optional] 

## Methods

### NewAgentListResponse

`func NewAgentListResponse() *AgentListResponse`

NewAgentListResponse instantiates a new AgentListResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewAgentListResponseWithDefaults

`func NewAgentListResponseWithDefaults() *AgentListResponse`

NewAgentListResponseWithDefaults instantiates a new AgentListResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAgents

`func (o *AgentListResponse) GetAgents() []AgentResponse`

GetAgents returns the Agents field if non-nil, zero value otherwise.

### GetAgentsOk

`func (o *AgentListResponse) GetAgentsOk() (*[]AgentResponse, bool)`

GetAgentsOk returns a tuple with the Agents field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAgents

`func (o *AgentListResponse) SetAgents(v []AgentResponse)`

SetAgents sets Agents field to given value.

### HasAgents

`func (o *AgentListResponse) HasAgents() bool`

HasAgents returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


