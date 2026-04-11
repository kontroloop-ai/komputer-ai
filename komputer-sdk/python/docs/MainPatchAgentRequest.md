# MainPatchAgentRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**connectors** | **List[str]** | connector names to attach | [optional] 
**instructions** | **str** |  | [optional] 
**lifecycle** | **str** |  | [optional] 
**memories** | **List[str]** | memory names to attach | [optional] 
**model** | **str** |  | [optional] 
**secret_refs** | **List[str]** | full replacement list of K8s secret names | [optional] 
**skills** | **List[str]** | skill names to attach | [optional] 
**system_prompt** | **str** | custom system prompt | [optional] 
**template_ref** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_patch_agent_request import MainPatchAgentRequest

# TODO update the JSON string below
json = "{}"
# create an instance of MainPatchAgentRequest from a JSON string
main_patch_agent_request_instance = MainPatchAgentRequest.from_json(json)
# print the JSON string representation of the object
print(MainPatchAgentRequest.to_json())

# convert the object into a dict
main_patch_agent_request_dict = main_patch_agent_request_instance.to_dict()
# create an instance of MainPatchAgentRequest from a dict
main_patch_agent_request_from_dict = MainPatchAgentRequest.from_dict(main_patch_agent_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


