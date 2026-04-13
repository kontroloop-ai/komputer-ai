# OfficesApi

All URIs are relative to *http://localhost:8080/api/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteOffice**](OfficesApi.md#deleteoffice) | **DELETE** /offices/{name} | Delete office |
| [**getOffice**](OfficesApi.md#getoffice) | **GET** /offices/{name} | Get office details |
| [**getOfficeEvents**](OfficesApi.md#getofficeevents) | **GET** /offices/{name}/events | Get office events |
| [**listOffices**](OfficesApi.md#listoffices) | **GET** /offices | List offices |



## deleteOffice

> { [key: string]: string; } deleteOffice(name, namespace)

Delete office

Deletes the office CR and cleans up Redis event streams for all member agents.

### Example

```ts
import {
  Configuration,
  OfficesApi,
} from '@komputer-ai/sdk';
import type { DeleteOfficeRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new OfficesApi();

  const body = {
    // string | Office name
    name: name_example,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies DeleteOfficeRequest;

  try {
    const data = await api.deleteOffice(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **name** | `string` | Office name | [Defaults to `undefined`] |
| **namespace** | `string` | Kubernetes namespace | [Optional] [Defaults to `undefined`] |

### Return type

**{ [key: string]: string; }**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Office deleted |  -  |
| **404** | Office not found |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getOffice

> OfficeResponse getOffice(name, namespace)

Get office details

Returns the current status and member list for a single office.

### Example

```ts
import {
  Configuration,
  OfficesApi,
} from '@komputer-ai/sdk';
import type { GetOfficeRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new OfficesApi();

  const body = {
    // string | Office name
    name: name_example,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies GetOfficeRequest;

  try {
    const data = await api.getOffice(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **name** | `string` | Office name | [Defaults to `undefined`] |
| **namespace** | `string` | Kubernetes namespace | [Optional] [Defaults to `undefined`] |

### Return type

[**OfficeResponse**](OfficeResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Office details |  -  |
| **404** | Office not found |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getOfficeEvents

> { [key: string]: any; } getOfficeEvents(name, namespace, limit)

Get office events

Returns merged events from all member agent Redis streams, sorted chronologically.

### Example

```ts
import {
  Configuration,
  OfficesApi,
} from '@komputer-ai/sdk';
import type { GetOfficeEventsRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new OfficesApi();

  const body = {
    // string | Office name
    name: name_example,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
    // number | Max events to return (1-200) (optional)
    limit: 56,
  } satisfies GetOfficeEventsRequest;

  try {
    const data = await api.getOfficeEvents(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **name** | `string` | Office name | [Defaults to `undefined`] |
| **namespace** | `string` | Kubernetes namespace | [Optional] [Defaults to `undefined`] |
| **limit** | `number` | Max events to return (1-200) | [Optional] [Defaults to `50`] |

### Return type

**{ [key: string]: any; }**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Office events |  -  |
| **400** | Invalid limit parameter |  -  |
| **404** | Office not found |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listOffices

> OfficeListResponse listOffices(namespace)

List offices

Returns all offices with their current status in the specified namespace.

### Example

```ts
import {
  Configuration,
  OfficesApi,
} from '@komputer-ai/sdk';
import type { ListOfficesRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new OfficesApi();

  const body = {
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies ListOfficesRequest;

  try {
    const data = await api.listOffices(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **namespace** | `string` | Kubernetes namespace | [Optional] [Defaults to `undefined`] |

### Return type

[**OfficeListResponse**](OfficeListResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of offices |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

