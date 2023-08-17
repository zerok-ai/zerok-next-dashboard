import { nanoid } from "nanoid";
import {
  type ScenarioCreationType,
  type WorkloadType,
} from "utils/scenarios/types";

export type ConditionRowStrings =
  | "property"
  | "operator"
  | "value"
  | "datatype";

export interface GroupByType {
  service: number | null;
  property: string;
  errors: {
    service: boolean;
    property: boolean;
  };
}
export interface ConditionRowType {
  property: string;
  operator: string;
  value: string;
  datatype: string;
  key: string;
  errors: {
    property: boolean;
    operator: boolean;
    value: boolean;
    datatype: boolean;
  };
}

export interface ConditionCardType {
  rootProperty: string;
  conditions: ConditionRowType[];
  key: string;
  errors: {
    rootProperty: boolean;
  };
}

export const PROBE_TIME_RANGES = [
  {
    label: "Forever",
    value: "forever",
  },
  {
    label: "6 hours",
    value: "-6h",
  },
  {
    label: "12 hours",
    value: "-12h",
  },
  {
    label: "24 hours",
    value: "-24h",
  },
  {
    label: "3 days",
    value: "-3d",
  },
  {
    label: "1 week",
    value: "-7d",
  },
];

export const getPropertyByType = (type: string | null) => {
  if (!type || !type.length) {
    return HTTP_PROPERTIES;
  }
  return !type?.split("/")[1].includes("sql")
    ? HTTP_PROPERTIES
    : SQL_PROPERTIES;
};

export const HTTP_PROPERTIES = [
  {
    label: "Latency",
    value: "latency",
    type: "double",
  },
  {
    label: "Source service",
    value: "source",
    type: "string",
  },
  {
    label: "Destination service",
    value: "destination",
    type: "string",
  },
  {
    label: "Request payload size",
    value: "req_body_size",
    type: "int",
  },
  {
    label: "Response payload size",
    value: "resp_body_size",
    type: "int",
  },
  {
    label: "Request method",
    value: "req_method",
    type: "string",
  },
  {
    label: "Request path",
    value: "req_path",
    type: "string",
  },
  {
    label: "Response status",
    value: "resp_status",
    type: "int",
  },
];

export const SQL_PROPERTIES = [
  {
    label: "Latency",
    value: "latency",
    type: "double",
  },
  {
    label: "Requester service",
    value: "source",
    type: "string",
  },
  {
    label: "MYSQL request command",
    value: "req_cmd",
    type: "string",
  },
  {
    label: "MYSQL request body",
    value: "req_body",
    type: "string",
  },
  {
    label: "MYSQL response status code",
    value: "resp_status",
    type: "int",
  },
];

export const CONDITIONS = [
  {
    label: "and",
    value: "and",
  },
  {
    label: "or",
    value: "or",
  },
  {
    label: "not",
    value: "not",
  },
];

export const STRING_OPERATORS = [
  {
    label: "is equal to",
    value: "equal",
  },
  {
    label: "is not equal to",
    value: "not_equal",
  },
];

export const NUMBER_OPERATORS = [
  {
    label: "is equal to",
    value: "equal",
  },
  {
    label: "is not equal to",
    value: "not_equal",
  },
  {
    label: "is less than",
    value: "less_than",
  },
  {
    label: "is less than or equal to",
    value: "less_than_or_equal_to",
  },
  {
    label: "is greater than",
    value: "greater_than",
  },
  {
    label: "is greater than or equal to",
    value: "greater_than_or_equal_to",
  },
];

export const getOperatorByType = (type: string) => {
  if (!type) return [];
  return type === "string" ? STRING_OPERATORS : NUMBER_OPERATORS;
};

export const getInputTypeByDatatype = (type: string) => {
  if (!type) return "text";
  return type === "string" ? "text" : "number";
};

export const getEmptyCondition = (): ConditionRowType => {
  return {
    property: "",
    operator: "",
    value: "",
    datatype: "",
    key: nanoid(),
    errors: {
      property: false,
      operator: false,
      value: false,
      datatype: false,
    },
  };
};

export const getEmptyCard = (): ConditionCardType => {
  return {
    rootProperty: "",
    conditions: [getEmptyCondition()],
    key: nanoid(),
    errors: {
      rootProperty: false,
    },
  };
};

export const EQUALS = [
  {
    label: "is equal to",
    value: "equals",
  },
  {
    label: "is not equal to",
    value: "not_equals",
  },
  {
    label: "is less than",
    value: "less_than",
  },
  {
    label: "is less than or equal to",
    value: "less_than_or_equal_to",
  },
  {
    label: "is greater than",
    value: "greater_than",
  },
  {
    label: "is greater than or equal to",
    value: "greater_than_or_equal_to",
  },
  {
    label: "exists",
    value: "exists",
  },
  {
    label: "does not exist",
    value: "not_exists",
  },
  {
    label: "in",
    value: "in",
  },
  {
    label: "not in",
    value: "not_in",
  },
];

export const CUSTOM_TYPES = [
  {
    label: "Null",
    value: "null",
  },
  {
    label: "Custom",
    value: "custom",
  },
];

export interface SlackChannelType {
  type: "channel" | "person";
  value: string;
}

export const SLACK_CHANNELS: SlackChannelType[] = [
  {
    type: "channel",
    value: "zerok",
  },
  {
    type: "person",
    value: "Varun",
  },
  {
    type: "channel",
    value: "tech",
  },
  {
    type: "person",
    value: "Shivam",
  },
  {
    type: "person",
    value: "Samyukktha",
  },
  {
    type: "channel",
    value: "oncall",
  },
];

export const buildProbeBody = (
  cards: ConditionCardType[],
  title: string,
  groupBy: GroupByType
): ScenarioCreationType => {
  const workloads = cards.map((card): WorkloadType => {
    return {
      service: card.rootProperty,
      trace_role: "server",
      protocol: "HTTP",
      rule: {
        type: "rule_group",
        condition: "AND",
        rules: card.conditions.map((condition) => {
          return {
            type: "rule",
            id: condition.property,
            field: condition.property,
            input: condition.datatype === "string" ? "string" : "number",
            operator: condition.operator,
            value: condition.value,
            datatype: condition.datatype,
          };
        }),
      },
    };
  });
  const body: ScenarioCreationType = {
    scenario_title: title,
    scenario_type: "USER",
    workloads,
    group_by: [
      {
        workload_index: groupBy.service as number,
        title: groupBy.property,
        hash: groupBy.property,
      },
    ],
  };
  return body;
};
