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

// {
//   "version": "1684149787",
//   "scenario_id": "1",
//   "scenario_title": "Exception",
//   "scenario_type": "SYSTEM",
//   "enabled": true,
//   "workloads": {
//       "55661a0e-25cb-5a1c-94cd-fad172b0caa2": {
//           "service": "*/*",
//           "trace_role": "server",
//           "protocol": "HTTP",
//           "rule": {
//               "type": "rule_group",
//               "condition": "AND",
//               "rules": [
//                   {
//                       "type": "rule",
//                       "id": "req_method",
//                       "field": "req_method",
//                       "datatype": "string",
//                       "input": "string",
//                       "operator": "equal",
//                       "value": "POST"
//                   },
//                   {
//                       "type": "rule",
//                       "id": "req_path",
//                       "field": "req_path",
//                       "datatype": "string",
//                       "input": "string",
//                       "operator": "equal",
//                       "value": "/exception"
//                   }
//               ]
//           }
//       }
//   },
//   "filter": {
//       "type": "workload",
//       "condition": "AND",
//       "workload_ids": [
//           "55661a0e-25cb-5a1c-94cd-fad172b0caa2"
//       ]
//   },
//   "group_by": [
//       {
//           "workload_id": "55661a0e-25cb-5a1c-94cd-fad172b0caa2",
//           "title": "source",
//           "hash": "source"
//       }
//   ],
//   "rate_limit": [
//       {
//           "bucket_max_size": 5,
//           "bucket_refill_size": 5,
//           "tick_duration": "1m"
//       }
//   ]
// }

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
