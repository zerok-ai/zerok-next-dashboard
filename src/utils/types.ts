import { HTTP_METHODS, SPAN_PROTOCOLS } from "./constants";

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

export interface ServiceDetail {
  service: string;
  pod_count: number;
  http_latency_in: {
    p01: null | number;
    p10: null | number;
    p25: null | number;
    p50: null | number;
    p75: null | number;
    p90: null | number;
  };
  http_req_throughput_in: number;
  http_error_rate_in: number;
  inbound_conns: number;
  outerHeight: number;
}
export interface IncidentDetail {
  issue_id: string;
  issue_title: string;
  scenario_id: string;
  scenario_version: string;
  total_count: number;
  velocity: number;
  source: string;
  destination: string;
  first_seen: string;
  last_seen: string;
  incidents: string[];
}
export interface SpanDetail {
  source: string;
  destination: string;
  error: boolean;
  metadata: string;
  latency_ms: number;
  protocol: string;
  status: string;
  parent_span_id: string;
  workload_id_list: string[];
  span_id?: string;
  children?: SpanDetail[];
}

export interface SpanResponse {
  [x: string]: SpanDetail;
}
[];

export interface HttpRequestDetail {
  req_path: string;
  req_method: (typeof HTTP_METHODS)[number];
  req_headers: GenericObject | string;
  req_body: GenericObject | null;
}

export interface HttpResponseDetail {
  resp_path: string;
  resp_method: (typeof HTTP_METHODS)[number];
  resp_headers: GenericObject | string;
  resp_body: GenericObject | null;
}

export interface SpanMetadata {
  protocol: (typeof SPAN_PROTOCOLS)[number];
  request_payload: HttpRequestDetail;
  response_payload: HttpRequestDetail;
}
