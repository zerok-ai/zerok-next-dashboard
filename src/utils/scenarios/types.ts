import { type ATTRIBUTE_EXECUTORS } from "utils/probes/constants";
import { type AttributeProtocolType } from "utils/probes/types";

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

export interface ScenarioGroupByType {
  workload_index: number;
  title: string;
  hash: string;
}

export interface RateLimitType {
  bucket_max_size: number;
  bucket_refill_size: number;
  tick_duration: string;
}

export interface ScenarioCreationType {
  scenario_title: string;
  scenario_type: "USER";
  workloads: WorkloadType[];
  group_by: ScenarioGroupByType[];
  rate_limit: RateLimitType[];
}

export interface ScenarioDetail {
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

export interface ScenarioDetailType {
  created_at: number;
  disabled_at?: number;
  scenario: ScenarioDetail;
}
