import { nanoid } from "nanoid";
import { HTTP_METHODS } from "utils/constants";
import {
  type ScenarioCreationType,
  type WorkloadType,
} from "utils/scenarios/types";
import { type SPAN_PROTOCOLS_TYPE } from "utils/types";

export type ConditionRowStrings =
  | "property"
  | "operator"
  | "value"
  | "datatype";

export interface GroupByType {
  service: string | null;
  property: string;
  key: string;
}
export interface ConditionRowType {
  property: string;
  operator: string;
  value: string;
  datatype: string;
  key: string;
}

export interface ConditionCardType {
  rootProperty: string;
  conditions: ConditionRowType[];
  key: string;
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

export const HTTP_OPTIONS = HTTP_METHODS.map((m) => ({ label: m, value: m }));

export const MYSQL_OPTIONS = [
  {
    label: "SELECT",
    value: "SELECT",
  },
  {
    label: "INSERT",
    value: "INSERT",
  },
  {
    label: "UPDATE",
    value: "UPDATE",
  },
  {
    label: "DELETE",
    value: "DELETE",
  },
];

export const getPropertyByType = (type: SPAN_PROTOCOLS_TYPE | null) => {
  if (!type || !type.length) {
    return HTTP_PROPERTIES;
  }
  return type === "http" ? HTTP_PROPERTIES : SQL_PROPERTIES;
};

export interface ProbePropertyType {
  label: string;
  value: string;
  type: string;
  options?: Array<{ label: string; value: string }>;
  helpText?: string;
}

export const HTTP_PROPERTIES: ProbePropertyType[] = [
  {
    label: "Latency",
    value: "latency",
    type: "double",
    helpText: "Latency of the service in milliseconds",
  },
  {
    label: "Source service",
    value: "source",
    type: "string",
    helpText: "Service that initiated the request",
  },
  {
    label: "Destination service",
    value: "destination",
    type: "string",
    helpText: "Service that received the request",
  },
  {
    label: "Request payload size",
    value: "req_body_size",
    type: "int",
    helpText: "Size of the request payload in KB",
  },
  {
    label: "Response payload size",
    value: "resp_body_size",
    type: "int",
    helpText: "Size of the response payload in KB",
  },
  {
    label: "Request method",
    value: "req_method",
    type: "select",
    options: HTTP_OPTIONS,
    helpText: "HTTP method of the request",
  },
  {
    label: "Request path",
    value: "req_path",
    type: "string",
    helpText: "Path of the request",
  },
  {
    label: "Response status",
    value: "resp_status",
    type: "int",
    helpText: "HTTP status code of the response",
  },
];

export const SQL_PROPERTIES: ProbePropertyType[] = [
  {
    label: "Latency",
    value: "latency",
    type: "double",
    helpText: "Latency of the service in milliseconds",
  },
  {
    label: "Requester service",
    value: "source",
    type: "string",
    helpText: "Service that initiated the request",
  },
  {
    label: "MYSQL request command",
    value: "req_cmd",
    type: "select",
    options: MYSQL_OPTIONS,
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
  if (type === "select") {
    return STRING_OPERATORS;
  }
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
  };
};

export const getEmptyGroupBy = (): GroupByType => {
  return {
    service: null,
    property: "",
    key: nanoid(),
  };
};

export const getEmptyCard = (): ConditionCardType => {
  return {
    rootProperty: "",
    conditions: [getEmptyCondition()],
    key: nanoid(),
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
  groupBy: GroupByType[]
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
  const groupByObject = groupBy.map((g) => {
    return {
      workload_index: cards.findIndex((c) => c.rootProperty === g.service),
      title: g.property,
      hash: g.property,
    };
  });
  const body: ScenarioCreationType = {
    scenario_title: title,
    scenario_type: "USER",
    workloads,
    group_by: groupByObject,
  };
  return body;
};
export interface ProbeFormType {
  cards: ConditionCardType[];
  groupBy: GroupByType[];
  name: string;
  time: string;
};
