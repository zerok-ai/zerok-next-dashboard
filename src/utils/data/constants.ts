import { type ObfuscationTabType } from "./types";

export const DATA_OBFUSCATION_TABS: Array<{
  label: string;
  value: ObfuscationTabType;
}> = [
  {
    label: "Obfuscation rules",
    value: "rules",
  },
  {
    label: "Whitelist",
    value: "whitelist",
  },
];

export const REGEX_DRAWER_WIDTH = 700;
