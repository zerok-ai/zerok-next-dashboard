export interface RuleType {
  type: "string";
  id: string;
  field: string;
  input: string;
  operator: string;
  value: string;
}

export interface RuleGroupType {
  type: "rule_group";
  condition: "AND" | "OR";
  rules: RuleType[] | RuleGroupType[];
}

export interface WorkloadType {
  service: string;
  trace_role: string;
  protocol: string;
  rule: RuleGroupType;
}

export interface ScenarioDetail {
  version: string;
  scenario_id: string;
  enabled: boolean;
  scenario_title: string;
  scenario_type: string;
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
