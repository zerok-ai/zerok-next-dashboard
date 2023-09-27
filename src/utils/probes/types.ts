import {
  type ATTRIBUTE_EXECUTORS,
  type ATTRIBUTE_PROTOCOLS,
} from "./constants";

export type AttributeProtocolType = (typeof ATTRIBUTE_PROTOCOLS)[number];

export type AttributeExecutorType = (typeof ATTRIBUTE_EXECUTORS)[number];

export type AttributeType =
  | {
      id: string;
      field: string;
      data_type: "int" | "string" | "string[]" | "bool";
      input: "int" | "string" | "string[]" | "bool";
      executor: (typeof ATTRIBUTE_EXECUTORS)[number];
    }
  | {
      id: string;
      field: string;
      data_type: "int" | "string" | "string[]" | "bool";
      input: "select";
      values: string;
      executor: (typeof ATTRIBUTE_EXECUTORS)[number];
    };

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
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
