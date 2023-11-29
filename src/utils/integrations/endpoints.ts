export const CREATE_INTEGRATION_ENDPOINT =
  "/v1/u/cluster/{cluster_id}/integration";

export const GET_INTEGRATION_ENDPOINT = `/v1/u/cluster/{cluster_id}/integration/{integration_id}`;

export const GET_SLACK_WORKSPACE_ENDPOINT = `/v1/u/slack/integration/fetch`;

export const DISABLE_SLACK_WORKSPACE_ENDPOINT = `/v1/u/slack/integration/disable`;

export const INITIATE_SLACK_WORKSPACE_ENDPOINT = `/v1/u/slack/integration/initiate`;

export const TEST_SAVED_PROM_CONNECTION_ENDPOINT = `/v1/u/cluster/{cluster_id}/integration/{prom_id}/status`;

export const TEST_UNSAVED_PROM_CONNECTION_ENDPOINT = `/v1/u/cluster/{cluster_id}/integration/unsynced/status`;

export const DELETE_INTEGRATION_ENDPOINT = `/v1/u/cluster/{cluster_id}/integration/{integration_id}`;
