import { type WorkloadType, type RuleGroupType } from "./types";

export const renderScenarioString = (
  scenarios: Record<string, WorkloadType> | null
) => {
  console.log({ scenarios });
  if (!scenarios) {
    return null;
  }
  const scen = scenarios[Object.keys(scenarios)[0]];
  let str = ``;
  str += `Where ${scen.trace_role} is equal to ${scen.service} AND PROTOCOL is equal to ${scen.protocol} AND`;
  const getStringFromRuleGroups = (rule: RuleGroupType = scen.rule) => {
    let str = ``;
    rule.rules.forEach((r) => {
      if (r.type === "rule_group") {
        str += ` ${r.condition} (${getStringFromRuleGroups(r)})`;
      } else {
        str += ` ${r.field} ${r.operator} ${r.value}`;
      }
    });
    return str;
  };
  return str + getStringFromRuleGroups();
};
