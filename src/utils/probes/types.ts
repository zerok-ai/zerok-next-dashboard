import {
  type ATTRIBUTE_EXECUTORS,
  type ATTRIBUTE_PROTOCOLS,
  type ATTRIBUTE_SUPPORTED_FORMATS,
} from "./constants";

export type AttributeProtocolType = (typeof ATTRIBUTE_PROTOCOLS)[number];

export type AttributeExecutorType = (typeof ATTRIBUTE_EXECUTORS)[number];

export type AttributeSupportedType =
  (typeof ATTRIBUTE_SUPPORTED_FORMATS)[number];

export type AttributeType =
  | {
      id: string;
      field: string;
      data_type: "int" | "string" | "string[]" | "bool";
      input: "int" | "string" | "string[]" | "bool";
      supported_formats?: AttributeSupportedType[];
      executor: (typeof ATTRIBUTE_EXECUTORS)[number];
      type: "option";
    }
  | {
      id: string;
      field: string;
      data_type: "int" | "string" | "string[]" | "bool";
      input: "select";
      values: string;
      json_key?: boolean;
      supported_formats?: AttributeSupportedType[];
      executor: (typeof ATTRIBUTE_EXECUTORS)[number];
      type: "option";
    };

export type AttributeOptionType = AttributeType | { type: "divider" };
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export type AttributeStateType = {
  [key in (typeof ATTRIBUTE_PROTOCOLS)[number]]: Array<{
    executor: (typeof ATTRIBUTE_EXECUTORS)[number];
    key_set_name: string;
    attribute_list: AttributeType[];
  }>;
};

export interface AttributeResponseType {
  protocol: (typeof ATTRIBUTE_PROTOCOLS)[number];
  attribute_details: Array<{
    key_set_name: string;
    executor: (typeof ATTRIBUTE_EXECUTORS)[number];
    attribute_list: AttributeType[];
  }>;
}

export interface RuleType {
  type: "rule" | "rule_group";
  field: string;
  input: string;
  id: string;
  operator: string;
  value: string;
  json_path?: string[];
}

export interface RuleGroupType {
  type: "rule_group";
  condition: "AND";
  rules: RuleType[];
}

export interface WorkloadType {
  service: string;
  trace_role: "server";
  executor: (typeof ATTRIBUTE_EXECUTORS)[number];
  protocol: AttributeProtocolType;
  rule: RuleGroupType;
}

export interface ProbeDetailType {
  version: string;
  scenario_id: string;
  enabled: boolean;
  scenario_title: string;
  scenario_type: string;
  first_seen: string;
  last_seen: string;
  total_count: number;
  velocity: number;
  sources: string[];
  destinations: string[];
  group_by: Array<{
    hash: string;
    title: string;
    workload_id: string;
  }>;
  workloads: Record<string, WorkloadType>;
  filter: {
    type: string;
    condition: "AND" | "OR";
    workload_ids: string[];
  };
  rate_limit: Array<{
    bucket_max_size: number;
    bucket_refill_size: number;
    tick_duration: string;
  }>;
}

export interface ProbeListType {
  created_at: number;
  disabled_at?: number;
  scenario: ProbeDetailType;
}

export interface ProbeListResponseType {
  scenarios: ProbeListType[];
  total_rows: number;
}

export interface ProbeGroupByType {
  workload_index: number;
  title: string;
  hash: string;
}

export interface RateLimitType {
  bucket_max_size: number;
  bucket_refill_size: number;
  tick_duration: string;
}
export interface ProbeCreationType {
  scenario_title: string;
  scenario_type: "USER";
  workloads: WorkloadType[];
  group_by: ProbeGroupByType[];
  rate_limit: RateLimitType[];
}
