export const LIST_SCENARIOS_ENDPOINT = `/v1/u/cluster/scenario?last_sync_ts=0`;

export const GET_SCENARIO_DETAILS_ENDPOINT = `/v1/c/{cluster_id}/scenario?scenario_id_list={scenario_id_list}&st={range}`;

export const GET_SCENARIO_TRACES_ENDPOINT = `/v1/c/{cluster_id}/scenario/{scenario_id}/incident?limit={limit}&offset={offset}`;
