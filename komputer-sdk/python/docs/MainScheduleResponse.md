# MainScheduleResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**agent_name** | **str** |  | [optional] 
**auto_delete** | **bool** |  | [optional] 
**created_at** | **str** |  | [optional] 
**failed_runs** | **int** |  | [optional] 
**keep_agents** | **bool** |  | [optional] 
**last_run_cost_usd** | **str** |  | [optional] 
**last_run_status** | **str** |  | [optional] 
**last_run_time** | **str** |  | [optional] 
**last_run_tokens** | **int** |  | [optional] 
**name** | **str** |  | [optional] 
**namespace** | **str** |  | [optional] 
**next_run_time** | **str** |  | [optional] 
**phase** | **str** |  | [optional] 
**run_count** | **int** |  | [optional] 
**schedule** | **str** |  | [optional] 
**successful_runs** | **int** |  | [optional] 
**timezone** | **str** |  | [optional] 
**total_cost_usd** | **str** |  | [optional] 
**total_tokens** | **int** |  | [optional] 

## Example

```python
from komputer_ai.models.main_schedule_response import MainScheduleResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainScheduleResponse from a JSON string
main_schedule_response_instance = MainScheduleResponse.from_json(json)
# print the JSON string representation of the object
print(MainScheduleResponse.to_json())

# convert the object into a dict
main_schedule_response_dict = main_schedule_response_instance.to_dict()
# create an instance of MainScheduleResponse from a dict
main_schedule_response_from_dict = MainScheduleResponse.from_dict(main_schedule_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


