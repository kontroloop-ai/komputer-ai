# MainOfficeMemberResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**last_task_cost_usd** | **str** |  | [optional] 
**name** | **str** |  | [optional] 
**role** | **str** |  | [optional] 
**task_status** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_office_member_response import MainOfficeMemberResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainOfficeMemberResponse from a JSON string
main_office_member_response_instance = MainOfficeMemberResponse.from_json(json)
# print the JSON string representation of the object
print(MainOfficeMemberResponse.to_json())

# convert the object into a dict
main_office_member_response_dict = main_office_member_response_instance.to_dict()
# create an instance of MainOfficeMemberResponse from a dict
main_office_member_response_from_dict = MainOfficeMemberResponse.from_dict(main_office_member_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


