# MainCreateSecretRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**data** | **Dict[str, str]** |  | 
**name** | **str** |  | 
**namespace** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_create_secret_request import MainCreateSecretRequest

# TODO update the JSON string below
json = "{}"
# create an instance of MainCreateSecretRequest from a JSON string
main_create_secret_request_instance = MainCreateSecretRequest.from_json(json)
# print the JSON string representation of the object
print(MainCreateSecretRequest.to_json())

# convert the object into a dict
main_create_secret_request_dict = main_create_secret_request_instance.to_dict()
# create an instance of MainCreateSecretRequest from a dict
main_create_secret_request_from_dict = MainCreateSecretRequest.from_dict(main_create_secret_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


