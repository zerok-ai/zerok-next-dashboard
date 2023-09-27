import { nanoid } from "nanoid";
import {
  type ATTRIBUTE_EXECUTORS,
  type ATTRIBUTE_PROTOCOLS,
} from "utils/probes/constants";
import {
  type AttributeProtocolType,
  type AttributeStateType,
} from "utils/probes/types";
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
  executor: (typeof ATTRIBUTE_EXECUTORS)[number] | "";
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

export interface ProbePropertyType {
  label: string;
  value: string;
  type: string;
  options?: Array<{ label: string; value: string }>;
  helpText?: string;
  groupByOnly?: boolean;
}

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

export const BOOLEAN_ATTRIBUTES = [
  {
    label: "Equal to",
    value: "equal",
  },
  {
    label: "Not Equal to",
    value: "not_equal",
  },
  {
    label: "Exists",
    value: "exists",
  },
  {
    label: "Not Exists",
    value: "not_exists",
  },
];

export const BOOLEAN_VALUES = ["true", "false"];

export const getOperatorByType = (type: string) => {
  if (!type) return [];
  if (type === "bool") {
    return BOOLEAN_ATTRIBUTES;
  }
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
    executor: "",
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

export const inputMap: GenericObject = {
  string: "string",
  select: "string",
  integer: "integer",
  int: "integer",
  double: "integer",
};

export const buildProbeBody = (
  cards: ConditionCardType[],
  title: string,
  groupBy: GroupByType[],
  sampling: {
    samples: number;
    duration: number;
    metric: "m" | "s" | "h" | "d";
  },
  attributes: AttributeStateType
): ScenarioCreationType => {
  const workloads: WorkloadType[] = [] as WorkloadType[];
  cards.forEach((card) => {
    type ExecutorWorkloadType = {
      [key in (typeof ATTRIBUTE_EXECUTORS)[number]]: ConditionRowType[];
    };
    const protocolAttributes =
      attributes[card.protocol as AttributeProtocolType];
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const executorWorkload = {} as ExecutorWorkloadType;
    card.conditions.forEach((condition) => {
      if (!executorWorkload[condition.executor!]) {
        executorWorkload[condition.executor!] = [];
      }
      executorWorkload[condition.executor!].push(condition);
    });
    Object.keys(executorWorkload).forEach((executor) => {
      const attributes = protocolAttributes
        .map((attribute) => {
          return attribute.attribute_list.map((a) => {
            return a;
          });
        })
        .flat();
      let service = card.rootProperty;
      if (card.rootProperty.includes("*/*")) {
        service = "*/*";
      }
      const workload: WorkloadType = {
        service,
        executor: executor as (typeof ATTRIBUTE_EXECUTORS)[number],
        trace_role: "server",
        protocol: card.protocol.toUpperCase(),
        rule: {
          type: "rule_group",
          condition: "AND",
          rules: executorWorkload[
            executor as (typeof ATTRIBUTE_EXECUTORS)[number]
          ].map((condition) => {
            const attribute = attributes.find(
              (a) => a.id === condition.property
            );
            return {
              type: "rule",
              id: condition.property,
              field: attribute!.field,
              input: attribute!.input,
              operator: condition.operator,
              value: condition.value,
              datatype: condition.datatype,
            };
          }),
        },
      };
      workloads.push(workload);
    });
  });

  const groupByObject = groupBy.map((g) => {
    return {
      workload_index: workloads.findIndex((c) => {
        if (
          c.service.includes("*/*") &&
          g.service?.includes("*/*") &&
          c.executor === g.executor
        ) {
          return true;
        }
        return c.service === g.service && c.executor === g.executor;
      }),
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
}
