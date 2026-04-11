# MainConnectorResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**agent_names** | **List[str]** |  | [optional] 
**attached_agents** | **int** |  | [optional] 
**auth_secret_key** | **str** |  | [optional] 
**auth_secret_name** | **str** |  | [optional] 
**auth_type** | **str** |  | [optional] 
**created_at** | **str** |  | [optional] 
**display_name** | **str** |  | [optional] 
**name** | **str** |  | [optional] 
**namespace** | **str** |  | [optional] 
**oauth_status** | **str** | \&quot;pending\&quot;, \&quot;connected\&quot;, \&quot;\&quot; | [optional] 
**service** | **str** |  | [optional] 
**type** | **str** |  | [optional] 
**url** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_connector_response import MainConnectorResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainConnectorResponse from a JSON string
main_connector_response_instance = MainConnectorResponse.from_json(json)
# print the JSON string representation of the object
print(MainConnectorResponse.to_json())

# convert the object into a dict
main_connector_response_dict = main_connector_response_instance.to_dict()
# create an instance of MainConnectorResponse from a dict
main_connector_response_from_dict = MainConnectorResponse.from_dict(main_connector_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


