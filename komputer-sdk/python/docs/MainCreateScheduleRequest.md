# MainCreateScheduleRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**agent** | [**MainCreateScheduleAgentSpec**](MainCreateScheduleAgentSpec.md) |  | [optional] 
**agent_name** | **str** |  | [optional] 
**auto_delete** | **bool** |  | [optional] 
**instructions** | **str** |  | 
**keep_agents** | **bool** |  | [optional] 
**name** | **str** |  | 
**namespace** | **str** |  | [optional] 
**schedule** | **str** |  | 
**timezone** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_create_schedule_request import MainCreateScheduleRequest

# TODO update the JSON string below
json = "{}"
# create an instance of MainCreateScheduleRequest from a JSON string
main_create_schedule_request_instance = MainCreateScheduleRequest.from_json(json)
# print the JSON string representation of the object
print(MainCreateScheduleRequest.to_json())

# convert the object into a dict
main_create_schedule_request_dict = main_create_schedule_request_instance.to_dict()
# create an instance of MainCreateScheduleRequest from a dict
main_create_schedule_request_from_dict = MainCreateScheduleRequest.from_dict(main_create_schedule_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


