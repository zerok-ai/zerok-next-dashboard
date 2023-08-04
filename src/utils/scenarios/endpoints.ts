export const LIST_SCENARIOS_ENDPOINT = `/v1/u/cluster/scenario?last_sync_ts=0`;

export const GET_SCENARIO_DETAILS_ENDPOINT = `/v1/c/{cluster_id}/axon/scenario?scenario_id_list={scenario_id_list}&st={range}`;

export const GET_SCENARIO_TRACES_ENDPOINT = `/v1/c/{cluster_id}/axon/scenario/{scenario_id}/incident?limit={limit}&offset={offset}&issue_hash={issue_hash}`;

export const GET_TRACE_GROUPS_ENDPOINT = `/v1/c/{cluster_id}/axon/issue?limit={limit}&offset={offset}&st={range}&scenario_id_list={scenario_id}`;
