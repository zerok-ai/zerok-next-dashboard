import { type ReactNode } from "react";

import { type HTTP_METHODS, type SPAN_PROTOCOLS } from "./constants";
import { type AttributeProtocolType } from "./probes/types";

export interface ChildrenType {
  children: React.ReactNode;
}

export type GenericObject = Record<string, any>;

export type HTTP_METHODS_TYPE = (typeof HTTP_METHODS)[number];

export type SPAN_PROTOCOLS_TYPE = (typeof SPAN_PROTOCOLS)[number];
export interface DrawerNavItemType {
  icon?: ReactNode;
  label: string;
  path: string[];
  highlightIcon?: ReactNode;
  reactIcon?: (className: string) => React.ReactNode;
  type: "single" | "group";
  children?: Array<{
    label: string;
    path: string;
  }>;
  openOnClick?: boolean;
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
    p99: null | number;
  };
  http_req_throughput_in: number;
  http_error_rate_in: number;
  inbound_conns: number;
  outerHeight: number;
  protocol: "http" | "" | AttributeProtocolType;
}

export interface PodStatusDetail {
  message: string;
  phase: string;
  ready: boolean;
  reason: string;
}

export interface PodDetail {
  containers: number;
  pod: string;
  service: string;
  status: PodStatusDetail;
  start_time: string;
}
export interface IssueDetail {
  issue_hash: string;
  issue_title: string;
  scenario_id: string;
  scenario_version: string;
  total_count: number;
  velocity: number;
  sources: string[];
  destinations: string[];
  first_seen: string;
  last_seen: string;
  incidents: string[];
}

export interface SpanErrorDetail {
  exception_type: string;
  message: string;
  error_type: string;
  hash: string;
  span_id?: string;
  source?: string;
  destination?: string;
  service: string;
}
export interface SpanDetail {
  source: string;
  destination: string;
  error: boolean;
  metadata: string;
  latency: number;
  protocol: SPAN_PROTOCOLS_TYPE;
  status: string;
  kind: "CLIENT" | "SERVER";
  method: HTTP_METHODS_TYPE;
  route: string;
  parent_span_id: string;
  workload_id_list: string[];
  span_id: string;
  path: string;
  children?: SpanDetail[];
  has_raw_data?: boolean;
  start_time: string;
  timestamp?: string;
  level?: number;
  exception?: boolean;
  is_root: boolean;
  root?: boolean;
  exceptionParent?: string;
  exceptionSpan?: string;
  highlightException?: string | null;
  totalTime?: number;
  errors?: SpanErrorDetail[] | string;
  span_name: string;
  service_name: string;
  span_attributes?: GenericObject;
  resource_attributes?: GenericObject;
  scope_attributes?: GenericObject;
  all_attributes?: GenericObject;
}

export type SpanResponse = Record<string, SpanDetail>;

export interface HttpRequestDetail {
  req_path: string;
  req_method: (typeof HTTP_METHODS)[number];
  req_headers: GenericObject | string;
  req_body: GenericObject | string;
}

export interface HttpResponseDetail {
  resp_path: string;
  resp_method: (typeof HTTP_METHODS)[number];
  resp_headers: GenericObject | string;
  resp_body: GenericObject | string;
  resp_status: string;
}

export interface SpanRawData {
  protocol: (typeof SPAN_PROTOCOLS)[number];
  req_body: string | GenericObject;
  req_headers: string | GenericObject;
  resp_body: string | GenericObject;
  resp_headers: string | GenericObject;
}

export type SpanRawDataResponse = Record<string, SpanRawData>;

export interface ApiKeyType {
  id: string;
  key: string;
  createdAtMs: number;
}
