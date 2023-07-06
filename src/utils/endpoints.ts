export const LOGIN_ENDPOINT = `/v1/p/auth/login`;

export const FORGOT_PASSWORD_ENDPOINT = `/v1/p/user/password/recover/{email}`;

export const LOGOUT_ENDPOINT = `/v1/u/auth/logout`;

export const CLUSTER_ENDPOINT = `v1/u/org/cluster`;

export const TOP_APIKEY_ENDPOINT = `/v1/u/apikey/top`;

export const APIKEYS_ENDPOINT = `/v1/u/apikey`;

export const APIKEY_ID_ENDPOINT = `/v1/u/apikey/{id}`;

export const APIKEY_CREATE_ENDPOINT = `/v1/u/apikey/create`;

export const GET_USERS_ENDPOINT = `/v1/u/user`;

export const INVITE_USER_ENDPOINT = `/v1/u/user/invite`;

export const SET_USER_PASSWORD_ENDPOINT = `/v1/u/user/invite/set`;

export const LIST_SERVICES_ENDPOINT_V2 = `/v1/u/cluster/{id}/service/list?st=-5m`;

export const LIST_SERVICES_ENDPOINT = `/services.json`;

export const LIST_INCIDENTS_ENDPOINT = `/incidents.json`;

export const GET_INCIDENT_ENDPOINT = `/incident.json`;

export const LIST_SPANS_ENDPOINT = `/spans.json`;

export const GET_SPAN_ENDPOINT = `/span.json`;
