# CreateMemoryRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Content** | **string** |  | 
**Description** | Pointer to **string** |  | [optional] 
**Name** | **string** |  | 
**Namespace** | Pointer to **string** |  | [optional] 

## Methods

### NewCreateMemoryRequest

`func NewCreateMemoryRequest(content string, name string, ) *CreateMemoryRequest`

NewCreateMemoryRequest instantiates a new CreateMemoryRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCreateMemoryRequestWithDefaults

`func NewCreateMemoryRequestWithDefaults() *CreateMemoryRequest`

NewCreateMemoryRequestWithDefaults instantiates a new CreateMemoryRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetContent

`func (o *CreateMemoryRequest) GetContent() string`

GetContent returns the Content field if non-nil, zero value otherwise.

### GetContentOk

`func (o *CreateMemoryRequest) GetContentOk() (*string, bool)`

GetContentOk returns a tuple with the Content field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContent

`func (o *CreateMemoryRequest) SetContent(v string)`

SetContent sets Content field to given value.


### GetDescription

`func (o *CreateMemoryRequest) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *CreateMemoryRequest) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *CreateMemoryRequest) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *CreateMemoryRequest) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetName

`func (o *CreateMemoryRequest) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *CreateMemoryRequest) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *CreateMemoryRequest) SetName(v string)`

SetName sets Name field to given value.


### GetNamespace

`func (o *CreateMemoryRequest) GetNamespace() string`

GetNamespace returns the Namespace field if non-nil, zero value otherwise.

### GetNamespaceOk

`func (o *CreateMemoryRequest) GetNamespaceOk() (*string, bool)`

GetNamespaceOk returns a tuple with the Namespace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNamespace

`func (o *CreateMemoryRequest) SetNamespace(v string)`

SetNamespace sets Namespace field to given value.

### HasNamespace

`func (o *CreateMemoryRequest) HasNamespace() bool`

HasNamespace returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


