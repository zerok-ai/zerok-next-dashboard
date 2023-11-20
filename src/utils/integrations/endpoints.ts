export const CREATE_INTEGRATION_ENDPOINT =
  "/v1/u/cluster/{cluster_id}/integration";

export const GET_INTEGRATION_ENDPOINT = `/v1/u/cluster/{cluster_id}/integration`;

export const GET_SLACK_WORKSPACE_ENDPOINT = `/v1/u/slack/integration/fetch`;

export const DISABLE_SLACK_WORKSPACE_ENDPOINT = `/v1/u/slack/integration/disable`;

export const INITIATE_SLACK_WORKSPACE_ENDPOINT = `/v1/u/slack/integration/initiate`;

export const TEST_SAVED_PROM_CONNECTION_ENDPOINT = `v1/c/{cluster_id}/axon/prom/{prom_id}/status`;
