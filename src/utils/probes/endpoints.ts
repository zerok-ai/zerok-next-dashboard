export const PROBE_ATTRIBUTES_ENDPOINT = `/v1/u/cluster/attribute?protocol={protocol}`;

export const LIST_PROBES_ENDPOINT = `/v1/u/cluster/{cluster_id}/scenario?last_sync_ts=0`;

export const DELETE_PROBE_ENDPOINT = `/v1/u/cluster/{cluster_id}/scenario/{scenario_id}`;

export const UPDATE_PROBE_STATUS_ENDPOINT = `/v1/u/cluster/{cluster_id}/scenario/{scenario_id}/status`;
