# MainOfficeResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**active_agents** | **int** |  | [optional] 
**completed_agents** | **int** |  | [optional] 
**created_at** | **str** |  | [optional] 
**manager** | **str** |  | [optional] 
**members** | [**List[MainOfficeMemberResponse]**](MainOfficeMemberResponse.md) |  | [optional] 
**name** | **str** |  | [optional] 
**namespace** | **str** |  | [optional] 
**phase** | **str** |  | [optional] 
**total_agents** | **int** |  | [optional] 
**total_cost_usd** | **str** |  | [optional] 
**total_tokens** | **int** |  | [optional] 

## Example

```python
from komputer_ai.models.main_office_response import MainOfficeResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainOfficeResponse from a JSON string
main_office_response_instance = MainOfficeResponse.from_json(json)
# print the JSON string representation of the object
print(MainOfficeResponse.to_json())

# convert the object into a dict
main_office_response_dict = main_office_response_instance.to_dict()
# create an instance of MainOfficeResponse from a dict
main_office_response_from_dict = MainOfficeResponse.from_dict(main_office_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


