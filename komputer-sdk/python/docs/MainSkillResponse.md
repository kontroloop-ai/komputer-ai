# MainSkillResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**agent_names** | **List[str]** |  | [optional] 
**attached_agents** | **int** |  | [optional] 
**content** | **str** |  | [optional] 
**created_at** | **str** |  | [optional] 
**description** | **str** |  | [optional] 
**is_default** | **bool** |  | [optional] 
**name** | **str** |  | [optional] 
**namespace** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_skill_response import MainSkillResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainSkillResponse from a JSON string
main_skill_response_instance = MainSkillResponse.from_json(json)
# print the JSON string representation of the object
print(MainSkillResponse.to_json())

# convert the object into a dict
main_skill_response_dict = main_skill_response_instance.to_dict()
# create an instance of MainSkillResponse from a dict
main_skill_response_from_dict = MainSkillResponse.from_dict(main_skill_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


