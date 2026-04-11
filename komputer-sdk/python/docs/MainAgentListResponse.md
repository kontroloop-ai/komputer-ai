# MainAgentListResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**agents** | [**List[MainAgentResponse]**](MainAgentResponse.md) |  | [optional] 

## Example

```python
from komputer_ai.models.main_agent_list_response import MainAgentListResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainAgentListResponse from a JSON string
main_agent_list_response_instance = MainAgentListResponse.from_json(json)
# print the JSON string representation of the object
print(MainAgentListResponse.to_json())

# convert the object into a dict
main_agent_list_response_dict = main_agent_list_response_instance.to_dict()
# create an instance of MainAgentListResponse from a dict
main_agent_list_response_from_dict = MainAgentListResponse.from_dict(main_agent_list_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


