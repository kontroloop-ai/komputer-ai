# UpdateSecretRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Data** | **map[string]string** |  | 
**Namespace** | Pointer to **string** |  | [optional] 

## Methods

### NewUpdateSecretRequest

`func NewUpdateSecretRequest(data map[string]string, ) *UpdateSecretRequest`

NewUpdateSecretRequest instantiates a new UpdateSecretRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewUpdateSecretRequestWithDefaults

`func NewUpdateSecretRequestWithDefaults() *UpdateSecretRequest`

NewUpdateSecretRequestWithDefaults instantiates a new UpdateSecretRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetData

`func (o *UpdateSecretRequest) GetData() map[string]string`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *UpdateSecretRequest) GetDataOk() (*map[string]string, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *UpdateSecretRequest) SetData(v map[string]string)`

SetData sets Data field to given value.


### GetNamespace

`func (o *UpdateSecretRequest) GetNamespace() string`

GetNamespace returns the Namespace field if non-nil, zero value otherwise.

### GetNamespaceOk

`func (o *UpdateSecretRequest) GetNamespaceOk() (*string, bool)`

GetNamespaceOk returns a tuple with the Namespace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNamespace

`func (o *UpdateSecretRequest) SetNamespace(v string)`

SetNamespace sets Namespace field to given value.

### HasNamespace

`func (o *UpdateSecretRequest) HasNamespace() bool`

HasNamespace returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


