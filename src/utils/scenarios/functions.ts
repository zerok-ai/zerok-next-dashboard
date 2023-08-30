import { type ScenarioDetail } from "./types";

export const getScenarioString = (scenario: ScenarioDetail) => {
  const { workloads } = scenario;
  let workLoadString = "";
  Object.keys(workloads).forEach((key, index) => {
    const { rule, service } = workloads[key];
    workLoadString += `${service} where `;
    rule.rules.forEach((r, idx) => {
      const { operator, field, value } = r;
      workLoadString += `${field} ${operator} ${value} ${
        idx === rule.rules.length - 1 ? "" : "AND "
      }`;
    });
    if (index !== Object.keys(workloads).length - 1) workLoadString += "AND ";
  });
  return workLoadString;
};
