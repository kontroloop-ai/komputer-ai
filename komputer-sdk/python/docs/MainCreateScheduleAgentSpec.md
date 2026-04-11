# MainCreateScheduleAgentSpec


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**lifecycle** | **str** |  | [optional] 
**model** | **str** |  | [optional] 
**role** | **str** |  | [optional] 
**secret_refs** | **List[str]** |  | [optional] 
**template_ref** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_create_schedule_agent_spec import MainCreateScheduleAgentSpec

# TODO update the JSON string below
json = "{}"
# create an instance of MainCreateScheduleAgentSpec from a JSON string
main_create_schedule_agent_spec_instance = MainCreateScheduleAgentSpec.from_json(json)
# print the JSON string representation of the object
print(MainCreateScheduleAgentSpec.to_json())

# convert the object into a dict
main_create_schedule_agent_spec_dict = main_create_schedule_agent_spec_instance.to_dict()
# create an instance of MainCreateScheduleAgentSpec from a dict
main_create_schedule_agent_spec_from_dict = MainCreateScheduleAgentSpec.from_dict(main_create_schedule_agent_spec_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


