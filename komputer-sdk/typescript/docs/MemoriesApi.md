# MemoriesApi

All URIs are relative to *http://localhost:8080/api/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createMemory**](MemoriesApi.md#creatememoryoperation) | **POST** /memories | Create memory |
| [**deleteMemory**](MemoriesApi.md#deletememory) | **DELETE** /memories/{name} | Delete memory |
| [**getMemory**](MemoriesApi.md#getmemory) | **GET** /memories/{name} | Get memory details |
| [**listMemories**](MemoriesApi.md#listmemories) | **GET** /memories | List memories |
| [**patchMemory**](MemoriesApi.md#patchmemoryoperation) | **PATCH** /memories/{name} | Patch memory |



## createMemory

> MemoryResponse createMemory(request)

Create memory

Creates a new KomputerMemory CR that can be attached to agents as persistent context.

### Example

```ts
import {
  Configuration,
  MemoriesApi,
} from '@komputer-ai/sdk';
import type { CreateMemoryOperationRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new MemoriesApi();

  const body = {
    // CreateMemoryRequest | Memory creation request
    request: ...,
  } satisfies CreateMemoryOperationRequest;

  try {
    const data = await api.createMemory(body);
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
| **request** | [CreateMemoryRequest](CreateMemoryRequest.md) | Memory creation request | |

### Return type

[**MemoryResponse**](MemoryResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Memory created |  -  |
| **400** | Bad request |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteMemory

> { [key: string]: string; } deleteMemory(name, namespace)

Delete memory

Deletes the memory CR.

### Example

```ts
import {
  Configuration,
  MemoriesApi,
} from '@komputer-ai/sdk';
import type { DeleteMemoryRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new MemoriesApi();

  const body = {
    // string | Memory name
    name: name_example,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies DeleteMemoryRequest;

  try {
    const data = await api.deleteMemory(body);
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
| **name** | `string` | Memory name | [Defaults to `undefined`] |
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
| **200** | Memory deleted |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getMemory

> MemoryResponse getMemory(name, namespace)

Get memory details

Returns the content and attached agent count for a single memory.

### Example

```ts
import {
  Configuration,
  MemoriesApi,
} from '@komputer-ai/sdk';
import type { GetMemoryRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new MemoriesApi();

  const body = {
    // string | Memory name
    name: name_example,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies GetMemoryRequest;

  try {
    const data = await api.getMemory(body);
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
| **name** | `string` | Memory name | [Defaults to `undefined`] |
| **namespace** | `string` | Kubernetes namespace | [Optional] [Defaults to `undefined`] |

### Return type

[**MemoryResponse**](MemoryResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Memory details |  -  |
| **404** | Memory not found |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listMemories

> { [key: string]: any; } listMemories(namespace)

List memories

Returns all memories with content and attached agent counts in the specified namespace.

### Example

```ts
import {
  Configuration,
  MemoriesApi,
} from '@komputer-ai/sdk';
import type { ListMemoriesRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new MemoriesApi();

  const body = {
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies ListMemoriesRequest;

  try {
    const data = await api.listMemories(body);
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

**{ [key: string]: any; }**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of memories |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## patchMemory

> MemoryResponse patchMemory(name, request, namespace)

Patch memory

Updates the content or description of an existing memory.

### Example

```ts
import {
  Configuration,
  MemoriesApi,
} from '@komputer-ai/sdk';
import type { PatchMemoryOperationRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new MemoriesApi();

  const body = {
    // string | Memory name
    name: name_example,
    // PatchMemoryRequest | Fields to update
    request: ...,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies PatchMemoryOperationRequest;

  try {
    const data = await api.patchMemory(body);
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
| **name** | `string` | Memory name | [Defaults to `undefined`] |
| **request** | [PatchMemoryRequest](PatchMemoryRequest.md) | Fields to update | |
| **namespace** | `string` | Kubernetes namespace | [Optional] [Defaults to `undefined`] |

### Return type

[**MemoryResponse**](MemoryResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated memory |  -  |
| **400** | Bad request |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

