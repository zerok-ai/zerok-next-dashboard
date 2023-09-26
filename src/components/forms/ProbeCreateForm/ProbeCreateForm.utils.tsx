import { nanoid } from "nanoid";
import { HTTP_METHODS } from "utils/constants";
import {
  type ATTRIBUTE_EXECUTORS,
  type ATTRIBUTE_PROTOCOLS,
} from "utils/probes/constants";
import {
  type ScenarioCreationType,
  type WorkloadType,
} from "utils/scenarios/types";
import { type GenericObject } from "utils/types";

export type ConditionRowStrings =
  | "property"
  | "operator"
  | "value"
  | "datatype";

export interface GroupByType {
  service: string | null;
  property: string;
  key: string;
  protocol: (typeof ATTRIBUTE_PROTOCOLS)[number] | "";
}
export interface ConditionRowType {
  property: string;
  operator: string;
  value: string;
  datatype: string;
  executor?: (typeof ATTRIBUTE_EXECUTORS)[number];
  key: string;
}

export interface ConditionCardType {
  rootProperty: string;
  protocol: (typeof ATTRIBUTE_PROTOCOLS)[number] | "";
  conditions: ConditionRowType[];
  key: string;
}

export const PROBE_TIME_RANGES = [
  {
    label: "1 hour",
    value: "-1h",
  },
  {
    label: "3 hours",
    value: "-3h",
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

export interface ProbePropertyType {
  label: string;
  value: string;
  type: string;
  options?: Array<{ label: string; value: string }>;
  helpText?: string;
  groupByOnly?: boolean;
}

export const HTTP_PROPERTIES: ProbePropertyType[] = [
  {
    label: "Latency",
    value: "latency",
    type: "integer",
    helpText: "Latency of the service in milliseconds",
  },
  {
    label: "Source service",
    value: "source",
    type: "select",
    helpText: "Service that initiated the request",
  },
  {
    label: "Destination service",
    value: "destination",
    type: "select",
    helpText: "Service that received the request",
    groupByOnly: true,
  },
  {
    label: "Request payload size",
    value: "req_body_size",
    type: "integer",
    helpText: "Size of the request payload in bytes",
  },
  {
    label: "Response payload size",
    value: "resp_body_size",
    type: "integer",
    helpText: "Size of the response payload in bytes",
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
    type: "integer",
    helpText: "HTTP status code of the response",
  },
];

export const SQL_PROPERTIES: ProbePropertyType[] = [
  {
    label: "Latency",
    value: "latency",
    type: "integer",
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
    type: "integer",
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
    protocol: "",
  };
};

export const getEmptyCard = (): ConditionCardType => {
  return {
    rootProperty: "",
    protocol: "",
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

export const inputMap: GenericObject = {
  string: "string",
  select: "string",
  integer: "integer",
  int: "integer",
  double: "integer",
};

export const dataTypeMap = {};

export const buildProbeBody = (
  cards: ConditionCardType[],
  title: string,
  groupBy: GroupByType[],
  sampling: {
    samples: number;
    duration: number;
    metric: "m" | "s" | "h" | "d";
  }
): ScenarioCreationType => {
  const workloads = cards.map((card): WorkloadType => {
    let service = card.rootProperty;
    if (card.rootProperty.includes("*/*")) {
      service = "*/*";
    }
    return {
      service,
      trace_role: "server",
      protocol: card.protocol.toUpperCase(),
      rule: {
        type: "rule_group",
        condition: "AND",
        rules: card.conditions.map((condition) => {
          if (condition.property === "latency") {
            condition.value = (Number(condition.value) * 1000000).toString();
          }
          return {
            type: "rule",
            id: condition.property,
            field: condition.property,
            input: inputMap[condition.datatype],
            operator: condition.operator,
            value: condition.value,
            datatype: inputMap[condition.datatype],
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

  const rateLimit = [
    {
      bucket_max_size: Number(sampling.samples),
      bucket_refill_size: Number(sampling.samples),
      tick_duration: `${sampling.duration}${sampling.metric}`,
    },
  ];
  const body: ScenarioCreationType = {
    scenario_title: title,
    scenario_type: "USER",
    workloads,
    group_by: groupByObject,
    rate_limit: rateLimit,
  };
  return body;
};
export interface ProbeFormType {
  cards: ConditionCardType[];
  groupBy: GroupByType[];
  name: string;
  time: string;
  sampling: {
    samples: number;
    duration: number;
    metric: "m" | "s" | "h" | "d";
  };
};
