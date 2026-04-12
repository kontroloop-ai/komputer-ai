# komputer-ai@0.1.0

A TypeScript SDK client for the localhost API.

## Usage

First, install the SDK from npm.

```bash
npm install komputer-ai --save
```

Next, try it out.


```ts
import {
  Configuration,
  AgentsApi,
} from 'komputer-ai';
import type { AgentsNameWsGetRequest } from 'komputer-ai';

async function example() {
  console.log("🚀 Testing komputer-ai SDK...");
  const api = new AgentsApi();

  const body = {
    // string | Agent name
    name: name_example,
  } satisfies AgentsNameWsGetRequest;

  try {
    const data = await api.agentsNameWsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```


## Documentation

### API Endpoints

All URIs are relative to *http://localhost:8080/api/v1*

| Class | Method | HTTP request | Description
| ----- | ------ | ------------ | -------------
*AgentsApi* | [**agentsNameWsGet**](docs/AgentsApi.md#agentsnamewsget) | **GET** /agents/{name}/ws | Stream agent events (WebSocket)
*AgentsApi* | [**cancelAgentTask**](docs/AgentsApi.md#cancelagenttask) | **POST** /agents/{name}/cancel | Cancel agent task
*AgentsApi* | [**createAgent**](docs/AgentsApi.md#createagentoperation) | **POST** /agents | Create agent or send task
*AgentsApi* | [**deleteAgent**](docs/AgentsApi.md#deleteagent) | **DELETE** /agents/{name} | Delete agent
*AgentsApi* | [**getAgent**](docs/AgentsApi.md#getagent) | **GET** /agents/{name} | Get agent details
*AgentsApi* | [**getAgentEvents**](docs/AgentsApi.md#getagentevents) | **GET** /agents/{name}/events | Get agent events
*AgentsApi* | [**listAgents**](docs/AgentsApi.md#listagents) | **GET** /agents | List agents
*AgentsApi* | [**patchAgent**](docs/AgentsApi.md#patchagentoperation) | **PATCH** /agents/{name} | Patch agent
*ConnectorsApi* | [**createConnector**](docs/ConnectorsApi.md#createconnectoroperation) | **POST** /connectors | Create connector
*ConnectorsApi* | [**deleteConnector**](docs/ConnectorsApi.md#deleteconnector) | **DELETE** /connectors/{name} | Delete connector
*ConnectorsApi* | [**getConnector**](docs/ConnectorsApi.md#getconnector) | **GET** /connectors/{name} | Get connector details
*ConnectorsApi* | [**listConnectorTools**](docs/ConnectorsApi.md#listconnectortools) | **GET** /connectors/{name}/tools | List connector tools
*ConnectorsApi* | [**listConnectors**](docs/ConnectorsApi.md#listconnectors) | **GET** /connectors | List connectors
*MemoriesApi* | [**createMemory**](docs/MemoriesApi.md#creatememoryoperation) | **POST** /memories | Create memory
*MemoriesApi* | [**deleteMemory**](docs/MemoriesApi.md#deletememory) | **DELETE** /memories/{name} | Delete memory
*MemoriesApi* | [**getMemory**](docs/MemoriesApi.md#getmemory) | **GET** /memories/{name} | Get memory details
*MemoriesApi* | [**listMemories**](docs/MemoriesApi.md#listmemories) | **GET** /memories | List memories
*MemoriesApi* | [**patchMemory**](docs/MemoriesApi.md#patchmemoryoperation) | **PATCH** /memories/{name} | Patch memory
*OfficesApi* | [**deleteOffice**](docs/OfficesApi.md#deleteoffice) | **DELETE** /offices/{name} | Delete office
*OfficesApi* | [**getOffice**](docs/OfficesApi.md#getoffice) | **GET** /offices/{name} | Get office details
*OfficesApi* | [**getOfficeEvents**](docs/OfficesApi.md#getofficeevents) | **GET** /offices/{name}/events | Get office events
*OfficesApi* | [**listOffices**](docs/OfficesApi.md#listoffices) | **GET** /offices | List offices
*SchedulesApi* | [**createSchedule**](docs/SchedulesApi.md#createscheduleoperation) | **POST** /schedules | Create schedule
*SchedulesApi* | [**deleteSchedule**](docs/SchedulesApi.md#deleteschedule) | **DELETE** /schedules/{name} | Delete schedule
*SchedulesApi* | [**getSchedule**](docs/SchedulesApi.md#getschedule) | **GET** /schedules/{name} | Get schedule details
*SchedulesApi* | [**listSchedules**](docs/SchedulesApi.md#listschedules) | **GET** /schedules | List schedules
*SchedulesApi* | [**patchSchedule**](docs/SchedulesApi.md#patchscheduleoperation) | **PATCH** /schedules/{name} | Patch schedule
*SecretsApi* | [**createSecret**](docs/SecretsApi.md#createsecretoperation) | **POST** /secrets | Create managed secret
*SecretsApi* | [**deleteSecret**](docs/SecretsApi.md#deletesecret) | **DELETE** /secrets/{name} | Delete managed secret
*SecretsApi* | [**listSecrets**](docs/SecretsApi.md#listsecrets) | **GET** /secrets | List secrets
*SecretsApi* | [**updateSecret**](docs/SecretsApi.md#updatesecretoperation) | **PATCH** /secrets/{name} | Update managed secret
*SkillsApi* | [**createSkill**](docs/SkillsApi.md#createskilloperation) | **POST** /skills | Create skill
*SkillsApi* | [**deleteSkill**](docs/SkillsApi.md#deleteskill) | **DELETE** /skills/{name} | Delete skill
*SkillsApi* | [**getSkill**](docs/SkillsApi.md#getskill) | **GET** /skills/{name} | Get skill details
*SkillsApi* | [**listSkills**](docs/SkillsApi.md#listskills) | **GET** /skills | List skills
*SkillsApi* | [**patchSkill**](docs/SkillsApi.md#patchskilloperation) | **PATCH** /skills/{name} | Patch skill
*TemplatesApi* | [**listTemplates**](docs/TemplatesApi.md#listtemplates) | **GET** /templates | List agent templates
*TemplatesApi* | [**namespacesGet**](docs/TemplatesApi.md#namespacesget) | **GET** /namespaces | List namespaces


### Models

- [AgentListResponse](docs/AgentListResponse.md)
- [AgentResponse](docs/AgentResponse.md)
- [ConnectorResponse](docs/ConnectorResponse.md)
- [CreateAgentRequest](docs/CreateAgentRequest.md)
- [CreateConnectorRequest](docs/CreateConnectorRequest.md)
- [CreateMemoryRequest](docs/CreateMemoryRequest.md)
- [CreateScheduleAgentSpec](docs/CreateScheduleAgentSpec.md)
- [CreateScheduleRequest](docs/CreateScheduleRequest.md)
- [CreateSecretRequest](docs/CreateSecretRequest.md)
- [CreateSkillRequest](docs/CreateSkillRequest.md)
- [MemoryResponse](docs/MemoryResponse.md)
- [OfficeListResponse](docs/OfficeListResponse.md)
- [OfficeMemberResponse](docs/OfficeMemberResponse.md)
- [OfficeResponse](docs/OfficeResponse.md)
- [PatchAgentRequest](docs/PatchAgentRequest.md)
- [PatchMemoryRequest](docs/PatchMemoryRequest.md)
- [PatchScheduleRequest](docs/PatchScheduleRequest.md)
- [PatchSkillRequest](docs/PatchSkillRequest.md)
- [ScheduleListResponse](docs/ScheduleListResponse.md)
- [ScheduleResponse](docs/ScheduleResponse.md)
- [SecretListResponse](docs/SecretListResponse.md)
- [SecretResponse](docs/SecretResponse.md)
- [SkillResponse](docs/SkillResponse.md)
- [UpdateSecretRequest](docs/UpdateSecretRequest.md)

### Authorization

Endpoints do not require authorization.


## About

This TypeScript SDK client supports the [Fetch API](https://fetch.spec.whatwg.org/)
and is automatically generated by the
[OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `1.0`
- Package version: `0.1.0`
- Generator version: `7.21.0`
- Build package: `org.openapitools.codegen.languages.TypeScriptFetchClientCodegen`

The generated npm module supports the following:

- Environments
  * Node.js
  * Webpack
  * Browserify
- Language levels
  * ES5 - you must have a Promises/A+ library installed
  * ES6
- Module systems
  * CommonJS
  * ES6 module system


## Development

### Building

To build the TypeScript source code, you need to have Node.js and npm installed.
After cloning the repository, navigate to the project directory and run:

```bash
npm install
npm run build
```

### Publishing

Once you've built the package, you can publish it to npm:

```bash
npm publish
```

## License

[]()
