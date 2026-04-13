# SkillsApi

All URIs are relative to *http://localhost:8080/api/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSkill**](SkillsApi.md#createskilloperation) | **POST** /skills | Create skill |
| [**deleteSkill**](SkillsApi.md#deleteskill) | **DELETE** /skills/{name} | Delete skill |
| [**getSkill**](SkillsApi.md#getskill) | **GET** /skills/{name} | Get skill details |
| [**listSkills**](SkillsApi.md#listskills) | **GET** /skills | List skills |
| [**patchSkill**](SkillsApi.md#patchskilloperation) | **PATCH** /skills/{name} | Patch skill |



## createSkill

> SkillResponse createSkill(request)

Create skill

Creates a new KomputerSkill CR with script content that can be attached to agents.

### Example

```ts
import {
  Configuration,
  SkillsApi,
} from '@komputer-ai/sdk';
import type { CreateSkillOperationRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new SkillsApi();

  const body = {
    // CreateSkillRequest | Skill creation request
    request: ...,
  } satisfies CreateSkillOperationRequest;

  try {
    const data = await api.createSkill(body);
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
| **request** | [CreateSkillRequest](CreateSkillRequest.md) | Skill creation request | |

### Return type

[**SkillResponse**](SkillResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Skill created |  -  |
| **400** | Bad request |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteSkill

> { [key: string]: string; } deleteSkill(name, namespace)

Delete skill

Deletes the skill CR.

### Example

```ts
import {
  Configuration,
  SkillsApi,
} from '@komputer-ai/sdk';
import type { DeleteSkillRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new SkillsApi();

  const body = {
    // string | Skill name
    name: name_example,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies DeleteSkillRequest;

  try {
    const data = await api.deleteSkill(body);
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
| **name** | `string` | Skill name | [Defaults to `undefined`] |
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
| **200** | Skill deleted |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSkill

> SkillResponse getSkill(name, namespace)

Get skill details

Returns the content, description, and attached agent count for a single skill.

### Example

```ts
import {
  Configuration,
  SkillsApi,
} from '@komputer-ai/sdk';
import type { GetSkillRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new SkillsApi();

  const body = {
    // string | Skill name
    name: name_example,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies GetSkillRequest;

  try {
    const data = await api.getSkill(body);
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
| **name** | `string` | Skill name | [Defaults to `undefined`] |
| **namespace** | `string` | Kubernetes namespace | [Optional] [Defaults to `undefined`] |

### Return type

[**SkillResponse**](SkillResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Skill details |  -  |
| **404** | Skill not found |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listSkills

> { [key: string]: any; } listSkills(namespace)

List skills

Returns all skills with content and attached agent counts in the specified namespace.

### Example

```ts
import {
  Configuration,
  SkillsApi,
} from '@komputer-ai/sdk';
import type { ListSkillsRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new SkillsApi();

  const body = {
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies ListSkillsRequest;

  try {
    const data = await api.listSkills(body);
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
| **200** | List of skills |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## patchSkill

> SkillResponse patchSkill(name, request, namespace)

Patch skill

Updates the description or script content of an existing skill.

### Example

```ts
import {
  Configuration,
  SkillsApi,
} from '@komputer-ai/sdk';
import type { PatchSkillOperationRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new SkillsApi();

  const body = {
    // string | Skill name
    name: name_example,
    // PatchSkillRequest | Fields to update
    request: ...,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies PatchSkillOperationRequest;

  try {
    const data = await api.patchSkill(body);
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
| **name** | `string` | Skill name | [Defaults to `undefined`] |
| **request** | [PatchSkillRequest](PatchSkillRequest.md) | Fields to update | |
| **namespace** | `string` | Kubernetes namespace | [Optional] [Defaults to `undefined`] |

### Return type

[**SkillResponse**](SkillResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Updated skill |  -  |
| **400** | Bad request |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

