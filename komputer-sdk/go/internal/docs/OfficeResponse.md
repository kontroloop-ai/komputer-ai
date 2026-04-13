# OfficeResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ActiveAgents** | Pointer to **int32** |  | [optional] 
**CompletedAgents** | Pointer to **int32** |  | [optional] 
**CreatedAt** | Pointer to **string** |  | [optional] 
**Manager** | Pointer to **string** |  | [optional] 
**Members** | Pointer to [**[]OfficeMemberResponse**](OfficeMemberResponse.md) |  | [optional] 
**Name** | Pointer to **string** |  | [optional] 
**Namespace** | Pointer to **string** |  | [optional] 
**Phase** | Pointer to **string** |  | [optional] 
**TotalAgents** | Pointer to **int32** |  | [optional] 
**TotalCostUSD** | Pointer to **string** |  | [optional] 
**TotalTokens** | Pointer to **int32** |  | [optional] 

## Methods

### NewOfficeResponse

`func NewOfficeResponse() *OfficeResponse`

NewOfficeResponse instantiates a new OfficeResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOfficeResponseWithDefaults

`func NewOfficeResponseWithDefaults() *OfficeResponse`

NewOfficeResponseWithDefaults instantiates a new OfficeResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetActiveAgents

`func (o *OfficeResponse) GetActiveAgents() int32`

GetActiveAgents returns the ActiveAgents field if non-nil, zero value otherwise.

### GetActiveAgentsOk

`func (o *OfficeResponse) GetActiveAgentsOk() (*int32, bool)`

GetActiveAgentsOk returns a tuple with the ActiveAgents field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetActiveAgents

`func (o *OfficeResponse) SetActiveAgents(v int32)`

SetActiveAgents sets ActiveAgents field to given value.

### HasActiveAgents

`func (o *OfficeResponse) HasActiveAgents() bool`

HasActiveAgents returns a boolean if a field has been set.

### GetCompletedAgents

`func (o *OfficeResponse) GetCompletedAgents() int32`

GetCompletedAgents returns the CompletedAgents field if non-nil, zero value otherwise.

### GetCompletedAgentsOk

`func (o *OfficeResponse) GetCompletedAgentsOk() (*int32, bool)`

GetCompletedAgentsOk returns a tuple with the CompletedAgents field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCompletedAgents

`func (o *OfficeResponse) SetCompletedAgents(v int32)`

SetCompletedAgents sets CompletedAgents field to given value.

### HasCompletedAgents

`func (o *OfficeResponse) HasCompletedAgents() bool`

HasCompletedAgents returns a boolean if a field has been set.

### GetCreatedAt

`func (o *OfficeResponse) GetCreatedAt() string`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *OfficeResponse) GetCreatedAtOk() (*string, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *OfficeResponse) SetCreatedAt(v string)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *OfficeResponse) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetManager

`func (o *OfficeResponse) GetManager() string`

GetManager returns the Manager field if non-nil, zero value otherwise.

### GetManagerOk

`func (o *OfficeResponse) GetManagerOk() (*string, bool)`

GetManagerOk returns a tuple with the Manager field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetManager

`func (o *OfficeResponse) SetManager(v string)`

SetManager sets Manager field to given value.

### HasManager

`func (o *OfficeResponse) HasManager() bool`

HasManager returns a boolean if a field has been set.

### GetMembers

`func (o *OfficeResponse) GetMembers() []OfficeMemberResponse`

GetMembers returns the Members field if non-nil, zero value otherwise.

### GetMembersOk

`func (o *OfficeResponse) GetMembersOk() (*[]OfficeMemberResponse, bool)`

GetMembersOk returns a tuple with the Members field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMembers

`func (o *OfficeResponse) SetMembers(v []OfficeMemberResponse)`

SetMembers sets Members field to given value.

### HasMembers

`func (o *OfficeResponse) HasMembers() bool`

HasMembers returns a boolean if a field has been set.

### GetName

`func (o *OfficeResponse) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *OfficeResponse) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *OfficeResponse) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *OfficeResponse) HasName() bool`

HasName returns a boolean if a field has been set.

### GetNamespace

`func (o *OfficeResponse) GetNamespace() string`

GetNamespace returns the Namespace field if non-nil, zero value otherwise.

### GetNamespaceOk

`func (o *OfficeResponse) GetNamespaceOk() (*string, bool)`

GetNamespaceOk returns a tuple with the Namespace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNamespace

`func (o *OfficeResponse) SetNamespace(v string)`

SetNamespace sets Namespace field to given value.

### HasNamespace

`func (o *OfficeResponse) HasNamespace() bool`

HasNamespace returns a boolean if a field has been set.

### GetPhase

`func (o *OfficeResponse) GetPhase() string`

GetPhase returns the Phase field if non-nil, zero value otherwise.

### GetPhaseOk

`func (o *OfficeResponse) GetPhaseOk() (*string, bool)`

GetPhaseOk returns a tuple with the Phase field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPhase

`func (o *OfficeResponse) SetPhase(v string)`

SetPhase sets Phase field to given value.

### HasPhase

`func (o *OfficeResponse) HasPhase() bool`

HasPhase returns a boolean if a field has been set.

### GetTotalAgents

`func (o *OfficeResponse) GetTotalAgents() int32`

GetTotalAgents returns the TotalAgents field if non-nil, zero value otherwise.

### GetTotalAgentsOk

`func (o *OfficeResponse) GetTotalAgentsOk() (*int32, bool)`

GetTotalAgentsOk returns a tuple with the TotalAgents field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTotalAgents

`func (o *OfficeResponse) SetTotalAgents(v int32)`

SetTotalAgents sets TotalAgents field to given value.

### HasTotalAgents

`func (o *OfficeResponse) HasTotalAgents() bool`

HasTotalAgents returns a boolean if a field has been set.

### GetTotalCostUSD

`func (o *OfficeResponse) GetTotalCostUSD() string`

GetTotalCostUSD returns the TotalCostUSD field if non-nil, zero value otherwise.

### GetTotalCostUSDOk

`func (o *OfficeResponse) GetTotalCostUSDOk() (*string, bool)`

GetTotalCostUSDOk returns a tuple with the TotalCostUSD field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTotalCostUSD

`func (o *OfficeResponse) SetTotalCostUSD(v string)`

SetTotalCostUSD sets TotalCostUSD field to given value.

### HasTotalCostUSD

`func (o *OfficeResponse) HasTotalCostUSD() bool`

HasTotalCostUSD returns a boolean if a field has been set.

### GetTotalTokens

`func (o *OfficeResponse) GetTotalTokens() int32`

GetTotalTokens returns the TotalTokens field if non-nil, zero value otherwise.

### GetTotalTokensOk

`func (o *OfficeResponse) GetTotalTokensOk() (*int32, bool)`

GetTotalTokensOk returns a tuple with the TotalTokens field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTotalTokens

`func (o *OfficeResponse) SetTotalTokens(v int32)`

SetTotalTokens sets TotalTokens field to given value.

### HasTotalTokens

`func (o *OfficeResponse) HasTotalTokens() bool`

HasTotalTokens returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


