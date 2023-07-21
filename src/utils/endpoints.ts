export const LOGIN_ENDPOINT = `/v1/p/auth/login`;

export const FORGOT_PASSWORD_ENDPOINT = `/v1/p/user/password/recover/{email}`;

export const LOGOUT_ENDPOINT = `/v1/u/auth/logout`;

export const CLUSTER_ENDPOINT = `/v1/u/org/cluster`;

export const TOP_APIKEY_ENDPOINT = `/v1/u/apikey/top`;

export const APIKEYS_ENDPOINT = `/v1/u/apikey`;

export const APIKEY_ID_ENDPOINT = `/v1/u/apikey/{id}`;

export const APIKEY_CREATE_ENDPOINT = `/v1/u/apikey/create`;

export const GET_USERS_ENDPOINT = `/v1/u/user`;

export const INVITE_USER_ENDPOINT = `/v1/u/user/invite`;

export const SET_USER_PASSWORD_ENDPOINT = `/v1/u/user/invite/set`;

export const LIST_SERVICES_ENDPOINT_V2 = `/v1/u/cluster/{id}/service/list?st=-5m`;

export const LIST_SERVICES_ENDPOINT = `/v1/u/cluster/{id}/service/list?st=-5m`;

export const LIST_ISSUES_ENDPOINT = `/v1/c/{id}/issue?`;

export const GET_ISSUE_ENDPOINT = `/v1/c/{cluster_id}/issue/{issue_id}`;

export const LIST_SPANS_ENDPOINT = `/v1/c/{cluster_id}/issue/{issue_id}/incident/{incident_id}`;

export const GET_SPAN_RAWDATA_ENDPOINT = `/v1/c/{cluster_id}/issue/{issue_id}/incident/{incident_id}/span/{span_id}`;

export const GET_INCIDENTS_ENDPOINT = `/v1/c/{cluster_id}/issue/{issue_id}/incident?limit=10&offset={offset}`;

export const GET_SERVICE_PODS_ENDPOINT = `/v1/u/cluster/{cluster_id}/pod/list?st=-5m&ns={namespace}&service_name={service_name}`;

export const GET_POD_DETAILS_ENDPOINT = `/v1/u/cluster/{cluster_id}/pod/details?st=-5m&ns={namespace}&pod_name={pod_name}`;
