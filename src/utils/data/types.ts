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

export type ObfuscationTabType = "rules" | "whitelist";
