# MainCreateSkillRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **str** |  | 
**description** | **str** |  | 
**name** | **str** |  | 
**namespace** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_create_skill_request import MainCreateSkillRequest

# TODO update the JSON string below
json = "{}"
# create an instance of MainCreateSkillRequest from a JSON string
main_create_skill_request_instance = MainCreateSkillRequest.from_json(json)
# print the JSON string representation of the object
print(MainCreateSkillRequest.to_json())

# convert the object into a dict
main_create_skill_request_dict = main_create_skill_request_instance.to_dict()
# create an instance of MainCreateSkillRequest from a dict
main_create_skill_request_from_dict = MainCreateSkillRequest.from_dict(main_create_skill_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


