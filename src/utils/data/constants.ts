import { type ObfuscationTabType } from "./types";

export const DATA_OBFUSCATION_TABS: Array<{
  label: string;
  value: ObfuscationTabType;
}> = [
  {
    label: "Custom Obfuscation Rules",
    value: "custom",
  },
  {
    label: "Default Obfuscation Rules",
    value: "default",
  },

  {
    label: "Whitelist",
    value: "whitelist",
  },
];

export const REGEX_DRAWER_WIDTH = 700;

export const DATA_OBFUSCATION_TABLE_PAGE_SIZE = 10;

export const DATA_PRIVACY_FLAGS = ["obfuscation"];
