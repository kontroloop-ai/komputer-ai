# MainScheduleListResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**schedules** | [**List[MainScheduleResponse]**](MainScheduleResponse.md) |  | [optional] 

## Example

```python
from komputer_ai.models.main_schedule_list_response import MainScheduleListResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainScheduleListResponse from a JSON string
main_schedule_list_response_instance = MainScheduleListResponse.from_json(json)
# print the JSON string representation of the object
print(MainScheduleListResponse.to_json())

# convert the object into a dict
main_schedule_list_response_dict = main_schedule_list_response_instance.to_dict()
# create an instance of MainScheduleListResponse from a dict
main_schedule_list_response_from_dict = MainScheduleListResponse.from_dict(main_schedule_list_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


