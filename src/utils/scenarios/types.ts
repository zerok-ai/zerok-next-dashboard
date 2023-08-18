export interface RuleType {
  type: "rule" | "rule_group";
  field: string;
  input: string;
  operator: string;
  value: string;
}

export interface RuleGroupType {
  type: "rule_group";
  condition: "AND";
  rules: RuleType[];
}

export interface WorkloadType {
  service: string;
  trace_role: "server";
  protocol: "HTTP" | "MYSQL";
  rule: RuleGroupType;
}

export interface ScenarioGroupByType {
  workload_index: number;
  title: string;
  hash: string;
}

export interface ScenarioCreationType {
  scenario_title: string;
  scenario_type: "USER";
  workloads: WorkloadType[];
  group_by: ScenarioGroupByType[];
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
  rate_limit: Array<{
    bucket_max_size: number;
    bucket_refill_size: number;
    tick_duration: string;
  }>;
  workloads: Record<string, WorkloadType>;
  filter: {
    type: string;
    condition: "AND" | "OR";
    workload_ids: string[];
  };
}
