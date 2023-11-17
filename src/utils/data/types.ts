import { z } from "zod";
export interface ObfuscationRuleType {
  id: string;
  name: string;
  analyzer: {
    type: "regex";
    pattern: string;
  };
  anonymizer: {
    operator: "replace";
    params: {
      new_value: string;
    };
  };
  created_at: number;
  updated_at: number;
  enabled: boolean;
}

export interface ObfuscationRuleResponseType {
  total_rows: number;
  obfuscations: ObfuscationRuleType[];
}

export type ObfuscationTabType = "rules" | "whitelist" | "default" | "custom";

export const RegexFormSchema = z.object({
  name: z.string().min(1, "Rule name cannot be empty"),
  pattern: z.string().min(1, "Pattern cannot be empty"),
  replacement: z.string().min(1, "Replacement cannot be empty"),
});
export type RegexFormSchemaType = z.infer<typeof RegexFormSchema>;

export interface DefaultRegexRuleType {
  name: string;
  supported_entities: string[];
  patterns: Array<{
    name: string;
    regex: string;
    score: number;
  }>;
}
