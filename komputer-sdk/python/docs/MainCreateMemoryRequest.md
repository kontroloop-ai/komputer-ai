# MainCreateMemoryRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **str** |  | 
**description** | **str** |  | [optional] 
**name** | **str** |  | 
**namespace** | **str** |  | [optional] 

## Example

```python
from komputer_ai.models.main_create_memory_request import MainCreateMemoryRequest

# TODO update the JSON string below
json = "{}"
# create an instance of MainCreateMemoryRequest from a JSON string
main_create_memory_request_instance = MainCreateMemoryRequest.from_json(json)
# print the JSON string representation of the object
print(MainCreateMemoryRequest.to_json())

# convert the object into a dict
main_create_memory_request_dict = main_create_memory_request_instance.to_dict()
# create an instance of MainCreateMemoryRequest from a dict
main_create_memory_request_from_dict = MainCreateMemoryRequest.from_dict(main_create_memory_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


