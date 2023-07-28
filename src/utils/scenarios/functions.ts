import { type RuleGroupType, type WorkloadType } from "./types";

export const renderScenarioString = (
  scenarios: Record<string, WorkloadType> | null
) => {
  if (!scenarios) {
    return null;
  }
  const scen = scenarios[Object.keys(scenarios)[0]];
  let str = ``;
  str += `Where ${scen.trace_role} is equal to ${scen.service} AND PROTOCOL is equal to ${scen.protocol} AND`;
  const getStringFromRuleGroups = (
    rule: RuleGroupType = scen.rule,
    operator: string = ""
  ) => {
    let str = ``;
    rule.rules.forEach((r, idx) => {
      if (r.type === "rule_group") {
        str += ` ${r.condition} (${getStringFromRuleGroups(r, r.condition)}) `;
      } else {
        str += ` ${idx === rule.rules.length - 1 ? operator : ``} ${r.field} ${
          r.operator
        } ${r.value} `;
      }
    });
    return str;
  };
  return str + `${getStringFromRuleGroups()}`;
};
