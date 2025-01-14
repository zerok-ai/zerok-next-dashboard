import { GPT_PAST_EVENT_PAGE_COUNT } from "./constants";

export const GPT_SCENARIO_ENDPOINT = `/v1/c/{cluster_id}/gpt/scenario/{scenario_id}`;

export const GPT_ISSUE_ENDPOINT = `/v1/c/{cluster_id}/gpt/issue/{issue_id}`;

export const GPT_INCIDENT_ENDPOINT = `/v1/c/{cluster_id}/gpt/incident/inference`;

export const GPT_INCIDENT_ENDPOINT_OLD = `/v1/c/{cluster_id}/gpt/issue/{issue_id}/incident/{incident_id}?useLangchain=True`;

export const GPT_PROMPT_OBSERVABILITY_ENDPOINT = `/v1/c/{cluster_id}/gpt/issue/observation`;

export const GPT_FEEDBACK_ENDPOINT = `/v1/c/{cluster_id}/gpt/issue/inference/feeback`;

export const GPT_LIST_INFERENCES_ENDPOINT = `/v1/c/{cluster_id}/gpt/issue/{issue_id}/getAllinferences`;

export const GPT_EVENTS_ENDPOINT = `/v1/c/{cluster_id}/gpt/issue/event`;

export const GPT_HISTORY_ENDPOINT = `/v1/c/{cluster_id}/gpt/incident/{issue_hash}/list/events?limit=${GPT_PAST_EVENT_PAGE_COUNT}&offset={offset}`;
