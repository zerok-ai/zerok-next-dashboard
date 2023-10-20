import { nanoid } from "nanoid";
import {
  type ATTRIBUTE_EXECUTORS,
  type ATTRIBUTE_PROTOCOLS,
} from "utils/probes/constants";
import {
  type AttributeProtocolType,
  type AttributeStateType,
  type AttributeSupportedType,
} from "utils/probes/types";
import {
  type ScenarioCreationType,
  type WorkloadType,
} from "utils/scenarios/types";
import { type GenericObject } from "utils/types";

import { type ConditionOperatorType } from "./ProbeCreateForm.types";

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
  json_path?: string | string[];
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

export const SUPPORTED_FORMAT_OPERATORS: Array<{
  label: string;
  value: AttributeSupportedType;
}> = [
  {
    label: "JSON",
    value: "JSON",
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
  {
    label: "contains",
    value: "contains",
  },
  {
    label: "does not contain",
    value: "does_not_contain",
  },
  {
    label: "begins with",
    value: "begins_with",
  },
  {
    label: "ends with",
    value: "ends_with",
  },
  {
    label: "exists",
    value: "exists",
  },
  {
    label: "not exists",
    value: "not_exists",
  },
  {
    label: "does not begin with",
    value: "does_not_begin_with",
  },
  {
    label: "does not end with",
    value: "does_not_end_with",
  },
  {
    label: "in",
    value: "in",
  },
  {
    label: "not in",
    value: "not_in",
  },
  {
    label: "matches",
    value: "matches",
  },
  {
    label: "does not match",
    value: "does_not_match",
  },
];

export const NUMBER_OPERATORS = [
  {
    label: "exists",
    value: "exists",
  },
  {
    label: "not exists",
    value: "not_exists",
  },
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
    label: "equal to",
    value: "equal",
  },
  {
    label: "not equal to",
    value: "not_equal",
  },
  {
    label: "exists",
    value: "exists",
  },
  {
    label: "not exists",
    value: "not_exists",
  },
];

export const BOOLEAN_VALUES = ["true", "false"];

export const getOperatorByType = (
  type: string,
  supported_formats: AttributeSupportedType[]
): ConditionOperatorType[] => {
  if (!type || !type.length) return STRING_OPERATORS;
  switch (type) {
    case "bool":
      return BOOLEAN_ATTRIBUTES;
    case "select":
      return STRING_OPERATORS;
    case "int":
    case "integer":
    case "double":
      return NUMBER_OPERATORS;
    case "string": {
      if (supported_formats.includes("JSON")) {
        const operators: ConditionOperatorType[] = [
          {
            title: "Evaluate as",
            disabled: true,
          },

          ...SUPPORTED_FORMAT_OPERATORS,
          {
            divider: true,
          },
          {
            title: "Operators",
            disabled: true,
          },
          ...STRING_OPERATORS,
        ];
        return operators;
      }
      return STRING_OPERATORS.filter(
        (op) => !["in", "not_in"].includes(op.value)
      );
    }
  }
  return STRING_OPERATORS;
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
  state: ProbeFormType,
  attributes: AttributeStateType
): ScenarioCreationType => {
  const values = { ...state };
  const { cards, groupBy, name: title, sampling } = values;
  const workloads: WorkloadType[] = [] as WorkloadType[];
  cards.forEach((card) => {
    type ExecutorWorkloadType = {
      [key in (typeof ATTRIBUTE_EXECUTORS)[number]]: ConditionRowType[];
    };
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const executorWorkload = {} as ExecutorWorkloadType;
    card.conditions.forEach((condition) => {
      if (!executorWorkload[condition.executor!]) {
        executorWorkload[condition.executor!] = [];
      }

      executorWorkload[condition.executor!].push(condition);
    });
    Object.keys(executorWorkload).forEach((executor) => {
      const protocol = card.protocol.toUpperCase() as AttributeProtocolType;
      const attributeOptions =
        attributes && protocol && attributes[protocol]
          ? [
              ...attributes[protocol].map((at) => {
                return [...at.attribute_list];
              }),
              ...attributes.GENERAL.map((at) => [...at.attribute_list]),
            ].flat()
          : [];
      let service = card.rootProperty;
      if (card.rootProperty.includes("*/*")) {
        service = "*/*";
      }
      const workload: WorkloadType = {
        service,
        executor: executor as (typeof ATTRIBUTE_EXECUTORS)[number],
        trace_role: "server",
        protocol: card.protocol.toUpperCase() as AttributeProtocolType,
        rule: {
          type: "rule_group",
          condition: "AND",
          rules: executorWorkload[
            executor as (typeof ATTRIBUTE_EXECUTORS)[number]
          ].map((condition) => {
            const attribute = attributeOptions.find(
              (a) => a.id === condition.property
            );
            if (
              condition.operator === "exists" ||
              condition.operator === "not_exists"
            ) {
              condition.value = "";
            }
            let jsonPath = {};
            if (
              condition.json_path &&
              attribute?.supported_formats?.includes("JSON")
            ) {
              jsonPath = {
                json_path: (condition.json_path as string).split("."),
              };
            }
            return {
              type: "rule",
              id: condition.property,
              field: attribute!.field,
              input: attribute!.input,
              operator: condition.operator,
              value: condition.value,
              datatype: inputMap[condition.datatype] ?? attribute!.data_type,
              ...jsonPath,
            };
          }),
        },
      };
      workloads.push(workload);
    });
  });
  let groupByError = false;
  const groupByObject = groupBy.map((g) => {
    const index = workloads.findIndex((c) => {
      if (
        c.service.includes("*/*") &&
        g.service?.includes("*/*") &&
        c.executor === g.executor
      ) {
        return true;
      }
      return c.service === g.service && c.executor === g.executor;
    });
    if (index < 0) groupByError = true;
    return {
      workload_index: index,
      title: g.property,
      hash: g.property,
    };
  });
  if (groupByError) {
    throw "Invalid group by configuration";
  }

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

export const getAttributeSelectOptions = (
  attributes: AttributeStateType | null,
  protocol: AttributeProtocolType
) => {
  if (!attributes || !protocol || !attributes[protocol]) return [];
  return [
    ...attributes[protocol].map((at) => {
      return [...at.attribute_list];
    }),
    { type: "divider" as const },
    ...attributes.GENERAL.map((at) => [...at.attribute_list]),
  ].flat();
};

export const getFlattenedAttributes = (
  attributes: AttributeStateType | null,
  protocol: AttributeProtocolType
) => {
  if (!attributes || !protocol || !attributes[protocol]) return [];
  return [
    ...attributes[protocol].map((at) => {
      return [...at.attribute_list];
    }),
    ...attributes.GENERAL.map((at) => [...at.attribute_list]),
  ].flat();
};
