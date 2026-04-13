# SecretsApi

All URIs are relative to *http://localhost:8080/api/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSecret**](SecretsApi.md#createsecretoperation) | **POST** /secrets | Create managed secret |
| [**deleteSecret**](SecretsApi.md#deletesecret) | **DELETE** /secrets/{name} | Delete managed secret |
| [**listSecrets**](SecretsApi.md#listsecrets) | **GET** /secrets | List secrets |
| [**updateSecret**](SecretsApi.md#updatesecretoperation) | **PATCH** /secrets/{name} | Update managed secret |



## createSecret

> SecretResponse createSecret(request)

Create managed secret

Creates a new Kubernetes secret managed by komputer.ai that can be attached to agents.

### Example

```ts
import {
  Configuration,
  SecretsApi,
} from '@komputer-ai/sdk';
import type { CreateSecretOperationRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new SecretsApi();

  const body = {
    // CreateSecretRequest | Secret creation request
    request: ...,
  } satisfies CreateSecretOperationRequest;

  try {
    const data = await api.createSecret(body);
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
| **request** | [CreateSecretRequest](CreateSecretRequest.md) | Secret creation request | |

### Return type

[**SecretResponse**](SecretResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Secret created |  -  |
| **400** | Bad request |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteSecret

> { [key: string]: string; } deleteSecret(name, namespace)

Delete managed secret

Deletes a managed Kubernetes secret.

### Example

```ts
import {
  Configuration,
  SecretsApi,
} from '@komputer-ai/sdk';
import type { DeleteSecretRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new SecretsApi();

  const body = {
    // string | Secret name
    name: name_example,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies DeleteSecretRequest;

  try {
    const data = await api.deleteSecret(body);
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
| **name** | `string` | Secret name | [Defaults to `undefined`] |
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
| **200** | Secret deleted |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listSecrets

> SecretListResponse listSecrets(namespace, all)

List secrets

Returns all secrets with key names (not values) and attached agent counts in the specified namespace.

### Example

```ts
import {
  Configuration,
  SecretsApi,
} from '@komputer-ai/sdk';
import type { ListSecretsRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new SecretsApi();

  const body = {
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
    // boolean | Include all secrets, not just managed ones (optional)
    all: true,
  } satisfies ListSecretsRequest;

  try {
    const data = await api.listSecrets(body);
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
| **all** | `boolean` | Include all secrets, not just managed ones | [Optional] [Defaults to `undefined`] |

### Return type

[**SecretListResponse**](SecretListResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of secrets |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateSecret

> { [key: string]: string; } updateSecret(name, request, namespace)

Update managed secret

Replaces the key-value pairs in a managed Kubernetes secret.

### Example

```ts
import {
  Configuration,
  SecretsApi,
} from '@komputer-ai/sdk';
import type { UpdateSecretOperationRequest } from '@komputer-ai/sdk';

async function example() {
  console.log("🚀 Testing @komputer-ai/sdk SDK...");
  const api = new SecretsApi();

  const body = {
    // string | Secret name
    name: name_example,
    // UpdateSecretRequest | Updated secret data
    request: ...,
    // string | Kubernetes namespace (optional)
    namespace: namespace_example,
  } satisfies UpdateSecretOperationRequest;

  try {
    const data = await api.updateSecret(body);
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
| **name** | `string` | Secret name | [Defaults to `undefined`] |
| **request** | [UpdateSecretRequest](UpdateSecretRequest.md) | Updated secret data | |
| **namespace** | `string` | Kubernetes namespace | [Optional] [Defaults to `undefined`] |

### Return type

**{ [key: string]: string; }**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Secret updated |  -  |
| **400** | Bad request |  -  |
| **500** | Internal error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

