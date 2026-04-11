# MainAgentResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**connectors** | **List[str]** | KomputerConnector names attached to this agent | [optional] 
**created_at** | **str** |  | [optional] 
**instructions** | **str** | User task (spec.instructions) | [optional] 
**last_task_cost_usd** | **str** |  | [optional] 
**last_task_message** | **str** |  | [optional] 
**lifecycle** | **str** |  | [optional] 
**memories** | **List[str]** | KomputerMemory names attached to this agent | [optional] 
**model** | **str** |  | [optional] 
**model_context_window** | **int** |  | [optional] 
**name** | **str** |  | [optional] 
**namespace** | **str** |  | [optional] 
**secrets** | **List[str]** | Key names from K8s Secrets (not values) | [optional] 
**skills** | **List[str]** | KomputerSkill names attached to this agent | [optional] 
**status** | **str** |  | [optional] 
**system_prompt** | **str** | Custom system prompt (spec.systemPrompt) | [optional] 
**task_status** | **str** |  | [optional] 
**total_cost_usd** | **str** |  | [optional] 
**total_tokens** | **int** |  | [optional] 

## Example

```python
from komputer_ai.models.main_agent_response import MainAgentResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainAgentResponse from a JSON string
main_agent_response_instance = MainAgentResponse.from_json(json)
# print the JSON string representation of the object
print(MainAgentResponse.to_json())

# convert the object into a dict
main_agent_response_dict = main_agent_response_instance.to_dict()
# create an instance of MainAgentResponse from a dict
main_agent_response_from_dict = MainAgentResponse.from_dict(main_agent_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


