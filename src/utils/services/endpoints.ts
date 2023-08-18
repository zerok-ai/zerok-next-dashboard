export const GET_SERVICE_PODS_ENDPOINT = `/v1/u/cluster/{cluster_id}/pod/list?st={range}&ns={namespace}&service_name={service_name}`;

export const GET_POD_DETAILS_ENDPOINT = `/v1/u/cluster/{cluster_id}/pod/details?st={range}&ns={namespace}&pod_name={pod_name}`;
