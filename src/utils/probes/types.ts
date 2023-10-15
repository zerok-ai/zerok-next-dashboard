import {
  type ATTRIBUTE_EXECUTORS,
  type ATTRIBUTE_PROTOCOLS,
  type ATTRIBUTE_SUPPORTED_FORMATS,
} from "./constants";

export type AttributeProtocolType = (typeof ATTRIBUTE_PROTOCOLS)[number];

export type AttributeExecutorType = (typeof ATTRIBUTE_EXECUTORS)[number];

export type AttributeSupportedType =
  (typeof ATTRIBUTE_SUPPORTED_FORMATS)[number];

export type AttributeType =
  | {
      id: string;
      field: string;
      data_type: "int" | "string" | "string[]" | "bool";
      input: "int" | "string" | "string[]" | "bool";
      supported_formats?: AttributeSupportedType[];
      executor: (typeof ATTRIBUTE_EXECUTORS)[number];
      type: "option";
    }
  | {
      id: string;
      field: string;
      data_type: "int" | "string" | "string[]" | "bool";
      input: "select";
      values: string;
      json_key?: boolean;
      supported_formats?: AttributeSupportedType[];
      executor: (typeof ATTRIBUTE_EXECUTORS)[number];
      type: "option";
    };

export type AttributeOptionType = AttributeType | { type: "divider" };
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
