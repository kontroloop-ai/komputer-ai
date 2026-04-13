# ScheduleListResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Schedules** | Pointer to [**[]ScheduleResponse**](ScheduleResponse.md) |  | [optional] 

## Methods

### NewScheduleListResponse

`func NewScheduleListResponse() *ScheduleListResponse`

NewScheduleListResponse instantiates a new ScheduleListResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewScheduleListResponseWithDefaults

`func NewScheduleListResponseWithDefaults() *ScheduleListResponse`

NewScheduleListResponseWithDefaults instantiates a new ScheduleListResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSchedules

`func (o *ScheduleListResponse) GetSchedules() []ScheduleResponse`

GetSchedules returns the Schedules field if non-nil, zero value otherwise.

### GetSchedulesOk

`func (o *ScheduleListResponse) GetSchedulesOk() (*[]ScheduleResponse, bool)`

GetSchedulesOk returns a tuple with the Schedules field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSchedules

`func (o *ScheduleListResponse) SetSchedules(v []ScheduleResponse)`

SetSchedules sets Schedules field to given value.

### HasSchedules

`func (o *ScheduleListResponse) HasSchedules() bool`

HasSchedules returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


