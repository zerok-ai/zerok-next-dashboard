import { type ObfuscationTabType } from "./types";

export const DATA_OBFUSCATION_TABS: Array<{
  label: string;
  value: ObfuscationTabType;
}> = [
  {
    label: "Default Obfuscation Rules",
    value: "default",
  },
  {
    label: "Custom Obfuscation Rules",
    value: "custom",
  },
  {
    label: "Whitelist",
    value: "whitelist",
  },
];

export const REGEX_DRAWER_WIDTH = 700;
