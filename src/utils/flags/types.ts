import { type ZkDataPrivacyFlagNames } from "utils/data/types";
import { type ZkGPTFlagNames } from "utils/gpt/types";

export interface ZkFlagBaseType<T> {
  enabled: boolean;
  enabledText?: string;
  disabledText?: string;
  value?: string | T;
}

export interface ZkFlagConfigType {
  gpt: Record<ZkGPTFlagNames, ZkFlagBaseType<string>>;
  dataprivacy: Record<ZkDataPrivacyFlagNames, ZkFlagBaseType<string>>;
}

export type ZkFlagFeatureType = keyof ZkFlagConfigType;

export type ZkAllFlagsType = Record<string, ZkFlagConfigType>;
