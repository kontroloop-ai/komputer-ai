# MainUpdateSecretRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**data** | **Dict[str, str]** |  | 
**namespace** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_update_secret_request import MainUpdateSecretRequest

# TODO update the JSON string below
json = "{}"
# create an instance of MainUpdateSecretRequest from a JSON string
main_update_secret_request_instance = MainUpdateSecretRequest.from_json(json)
# print the JSON string representation of the object
print(MainUpdateSecretRequest.to_json())

# convert the object into a dict
main_update_secret_request_dict = main_update_secret_request_instance.to_dict()
# create an instance of MainUpdateSecretRequest from a dict
main_update_secret_request_from_dict = MainUpdateSecretRequest.from_dict(main_update_secret_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


