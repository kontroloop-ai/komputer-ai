# MainSecretResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**agent_name** | **str** |  | [optional] 
**agent_names** | **List[str]** |  | [optional] 
**attached_agents** | **int** |  | [optional] 
**created_at** | **str** |  | [optional] 
**keys** | **List[str]** |  | [optional] 
**managed** | **bool** |  | [optional] 
**name** | **str** |  | [optional] 
**namespace** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_secret_response import MainSecretResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainSecretResponse from a JSON string
main_secret_response_instance = MainSecretResponse.from_json(json)
# print the JSON string representation of the object
print(MainSecretResponse.to_json())

# convert the object into a dict
main_secret_response_dict = main_secret_response_instance.to_dict()
# create an instance of MainSecretResponse from a dict
main_secret_response_from_dict = MainSecretResponse.from_dict(main_secret_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


