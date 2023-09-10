export const GET_PODS_ENDPOINT = `/v1/c/{cluster_id}/axon/prom/pods-info/trace/{trace_id}`;

export const GET_POD_METRICS_ENDPOINT = `/v1/c/{cluster_id}/axon/prom/container-metrics/pod/{namespace}/{pod-id}`;

export const GET_POD_CONTAINERS_ENDPOINT = `/v1/c/{cluster_id}/axon/prom/container-info/pod/{namespace}/{pod_id}`;
