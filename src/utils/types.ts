export interface ChildrenType {
  children: React.ReactNode;
}

export interface GenericObject {
  [key: string]: any;
}

export interface DrawerNavItemType {
  icon: string;
  label: string;
  path: string;
} 

export interface ApiKeyType {
  id: string;
  key: string;
  createdAtMs: number;
}

export interface useStatusType {
  loading: boolean;
  error: null | string;
}

export interface ApiKeyHidden {
  id: string;
  createdAtMs: number;
}

export interface ApiKeyDetail {
  id: string;
  createdAtMs: number;
  key: null | string;
}

export interface UserDetail {
  name: string;
  email: string;
  id: string;
}
// {
//   "service": "zkcloud/zk-auth",
//   "pod_count": 1,
//   "http_latency_in": {
//       "p01": null,
//       "p10": null,
//       "p25": null,
//       "p50": null,
//       "p75": null,
//       "p90": null,
//       "p99": null
//   },
//   "http_req_throughput_in": 0,
//   "http_error_rate_in": 0,
//   "inbound_conns": 7.08163e-7,
//   "outbound_conns": 0.000001277693
// },
export interface ServiceDetail {
  service: string;
  pod_count: number;
  http_latency_in:{
    p01: null | number,
    p10: null | number,
    p25: null | number,
    p50: null | number,
    p75: null | number,
    p90: null | number,
  },
  http_req_throughput_in: number;
  http_error_rate_in: number;
  inbound_conns: number;
  outerHeight: number;
}