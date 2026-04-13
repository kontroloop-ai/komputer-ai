# CreateScheduleAgentSpec

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Lifecycle** | Pointer to **string** |  | [optional] 
**Model** | Pointer to **string** |  | [optional] 
**Role** | Pointer to **string** |  | [optional] 
**SecretRefs** | Pointer to **[]string** |  | [optional] 
**TemplateRef** | Pointer to **string** |  | [optional] 

## Methods

### NewCreateScheduleAgentSpec

`func NewCreateScheduleAgentSpec() *CreateScheduleAgentSpec`

NewCreateScheduleAgentSpec instantiates a new CreateScheduleAgentSpec object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCreateScheduleAgentSpecWithDefaults

`func NewCreateScheduleAgentSpecWithDefaults() *CreateScheduleAgentSpec`

NewCreateScheduleAgentSpecWithDefaults instantiates a new CreateScheduleAgentSpec object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetLifecycle

`func (o *CreateScheduleAgentSpec) GetLifecycle() string`

GetLifecycle returns the Lifecycle field if non-nil, zero value otherwise.

### GetLifecycleOk

`func (o *CreateScheduleAgentSpec) GetLifecycleOk() (*string, bool)`

GetLifecycleOk returns a tuple with the Lifecycle field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLifecycle

`func (o *CreateScheduleAgentSpec) SetLifecycle(v string)`

SetLifecycle sets Lifecycle field to given value.

### HasLifecycle

`func (o *CreateScheduleAgentSpec) HasLifecycle() bool`

HasLifecycle returns a boolean if a field has been set.

### GetModel

`func (o *CreateScheduleAgentSpec) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *CreateScheduleAgentSpec) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *CreateScheduleAgentSpec) SetModel(v string)`

SetModel sets Model field to given value.

### HasModel

`func (o *CreateScheduleAgentSpec) HasModel() bool`

HasModel returns a boolean if a field has been set.

### GetRole

`func (o *CreateScheduleAgentSpec) GetRole() string`

GetRole returns the Role field if non-nil, zero value otherwise.

### GetRoleOk

`func (o *CreateScheduleAgentSpec) GetRoleOk() (*string, bool)`

GetRoleOk returns a tuple with the Role field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRole

`func (o *CreateScheduleAgentSpec) SetRole(v string)`

SetRole sets Role field to given value.

### HasRole

`func (o *CreateScheduleAgentSpec) HasRole() bool`

HasRole returns a boolean if a field has been set.

### GetSecretRefs

`func (o *CreateScheduleAgentSpec) GetSecretRefs() []string`

GetSecretRefs returns the SecretRefs field if non-nil, zero value otherwise.

### GetSecretRefsOk

`func (o *CreateScheduleAgentSpec) GetSecretRefsOk() (*[]string, bool)`

GetSecretRefsOk returns a tuple with the SecretRefs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSecretRefs

`func (o *CreateScheduleAgentSpec) SetSecretRefs(v []string)`

SetSecretRefs sets SecretRefs field to given value.

### HasSecretRefs

`func (o *CreateScheduleAgentSpec) HasSecretRefs() bool`

HasSecretRefs returns a boolean if a field has been set.

### GetTemplateRef

`func (o *CreateScheduleAgentSpec) GetTemplateRef() string`

GetTemplateRef returns the TemplateRef field if non-nil, zero value otherwise.

### GetTemplateRefOk

`func (o *CreateScheduleAgentSpec) GetTemplateRefOk() (*string, bool)`

GetTemplateRefOk returns a tuple with the TemplateRef field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTemplateRef

`func (o *CreateScheduleAgentSpec) SetTemplateRef(v string)`

SetTemplateRef sets TemplateRef field to given value.

### HasTemplateRef

`func (o *CreateScheduleAgentSpec) HasTemplateRef() bool`

HasTemplateRef returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


