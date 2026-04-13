# SecretListResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Secrets** | Pointer to [**[]SecretResponse**](SecretResponse.md) |  | [optional] 

## Methods

### NewSecretListResponse

`func NewSecretListResponse() *SecretListResponse`

NewSecretListResponse instantiates a new SecretListResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSecretListResponseWithDefaults

`func NewSecretListResponseWithDefaults() *SecretListResponse`

NewSecretListResponseWithDefaults instantiates a new SecretListResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSecrets

`func (o *SecretListResponse) GetSecrets() []SecretResponse`

GetSecrets returns the Secrets field if non-nil, zero value otherwise.

### GetSecretsOk

`func (o *SecretListResponse) GetSecretsOk() (*[]SecretResponse, bool)`

GetSecretsOk returns a tuple with the Secrets field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSecrets

`func (o *SecretListResponse) SetSecrets(v []SecretResponse)`

SetSecrets sets Secrets field to given value.

### HasSecrets

`func (o *SecretListResponse) HasSecrets() bool`

HasSecrets returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


