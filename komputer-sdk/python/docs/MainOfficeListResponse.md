# MainOfficeListResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**offices** | [**List[MainOfficeResponse]**](MainOfficeResponse.md) |  | [optional] 

## Example

```python
from komputer_ai.models.main_office_list_response import MainOfficeListResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MainOfficeListResponse from a JSON string
main_office_list_response_instance = MainOfficeListResponse.from_json(json)
# print the JSON string representation of the object
print(MainOfficeListResponse.to_json())

# convert the object into a dict
main_office_list_response_dict = main_office_list_response_instance.to_dict()
# create an instance of MainOfficeListResponse from a dict
main_office_list_response_from_dict = MainOfficeListResponse.from_dict(main_office_list_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


