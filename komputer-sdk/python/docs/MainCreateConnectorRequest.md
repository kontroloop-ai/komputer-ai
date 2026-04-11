# MainCreateConnectorRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auth_secret_key** | **str** |  | [optional] 
**auth_secret_name** | **str** |  | [optional] 
**auth_type** | **str** | \&quot;token\&quot; or \&quot;oauth\&quot; | [optional] 
**display_name** | **str** |  | [optional] 
**name** | **str** |  | 
**namespace** | **str** |  | [optional] 
**oauth_client_id** | **str** | OAuth client ID (stored in secret) | [optional] 
**oauth_client_secret** | **str** | OAuth client secret (stored in secret) | [optional] 
**service** | **str** |  | 
**type** | **str** |  | [optional] 
**url** | **str** |  | 

## Example

```python
from komputer_ai.models.main_create_connector_request import MainCreateConnectorRequest

# TODO update the JSON string below
json = "{}"
# create an instance of MainCreateConnectorRequest from a JSON string
main_create_connector_request_instance = MainCreateConnectorRequest.from_json(json)
# print the JSON string representation of the object
print(MainCreateConnectorRequest.to_json())

# convert the object into a dict
main_create_connector_request_dict = main_create_connector_request_instance.to_dict()
# create an instance of MainCreateConnectorRequest from a dict
main_create_connector_request_from_dict = MainCreateConnectorRequest.from_dict(main_create_connector_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


