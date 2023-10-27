import { z } from "zod";

export interface ObfuscationRuleType {
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
  created_at: string;
  updated_at: string;
  created_by: string;
  enabled: boolean;
}

export type ObfuscationTabType = "rules" | "whitelist" | "default" | "custom";

export const RegexFormSchema = z.object({
  name: z.string().min(1, "Rule name cannot be empty"),
  pattern: z.string().min(1, "Pattern cannot be empty"),
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
