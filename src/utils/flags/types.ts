import { type ZkGPTFlagNames } from "utils/gpt/types";
import { type ZkServicePageFlagNames } from "utils/health/types";

export interface ZkFlagBaseType<T> {
  enabled: boolean;
  enabledText?: string;
  disabledText?: string;
  value?: string | T;
}

export interface ZkFlagConfigType {
  gpt: Record<ZkGPTFlagNames, ZkFlagBaseType<string>>;
  servicepage: Record<ZkServicePageFlagNames, ZkFlagBaseType<string>>;
}

export type ZkFlagFeatureType = keyof ZkFlagConfigType;

export type ZkAllFlagsType = Record<string, ZkFlagConfigType>;
