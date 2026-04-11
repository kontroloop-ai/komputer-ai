# MainSecretListResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**secrets** | [**List[MainSecretResponse]**](MainSecretResponse.md) |  | [optional] 

## Example

```python
from komputer_ai.models.main_secret_list_response import MainSecretListResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainSecretListResponse from a JSON string
main_secret_list_response_instance = MainSecretListResponse.from_json(json)
# print the JSON string representation of the object
print(MainSecretListResponse.to_json())

# convert the object into a dict
main_secret_list_response_dict = main_secret_list_response_instance.to_dict()
# create an instance of MainSecretListResponse from a dict
main_secret_list_response_from_dict = MainSecretListResponse.from_dict(main_secret_list_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


