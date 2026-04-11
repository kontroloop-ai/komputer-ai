# MainCreateAgentRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**connectors** | **List[str]** | optional KomputerConnector names to attach | [optional] 
**instructions** | **str** |  | 
**lifecycle** | **str** | \&quot;\&quot;, \&quot;Sleep\&quot;, or \&quot;AutoDelete\&quot; | [optional] 
**memories** | **List[str]** | optional KomputerMemory names to attach | [optional] 
**model** | **str** |  | [optional] 
**name** | **str** |  | 
**namespace** | **str** | optional, defaults to server default | [optional] 
**office_manager** | **str** | set by manager MCP tool | [optional] 
**role** | **str** | \&quot;manager\&quot; or \&quot;\&quot; (default manager) | [optional] 
**secret_refs** | **List[str]** | names of existing K8s Secrets to attach | [optional] 
**skills** | **List[str]** | optional KomputerSkill names to attach | [optional] 
**system_prompt** | **str** | optional custom system prompt | [optional] 
**template_ref** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_create_agent_request import MainCreateAgentRequest

# TODO update the JSON string below
json = "{}"
# create an instance of MainCreateAgentRequest from a JSON string
main_create_agent_request_instance = MainCreateAgentRequest.from_json(json)
# print the JSON string representation of the object
print(MainCreateAgentRequest.to_json())

# convert the object into a dict
main_create_agent_request_dict = main_create_agent_request_instance.to_dict()
# create an instance of MainCreateAgentRequest from a dict
main_create_agent_request_from_dict = MainCreateAgentRequest.from_dict(main_create_agent_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


