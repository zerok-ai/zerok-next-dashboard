import {
  type ConditionCardType,
  type ConditionRowType,
  type GroupByType,
  type ProbeFormType,
} from "components/forms/ProbeCreateForm/ProbeCreateForm.utils";
import { nanoid } from "nanoid";
import { type ScenarioDetailType } from "utils/scenarios/types";

export const scenarioToProbeForm = (scenario: ScenarioDetailType) => {
  const cards: ConditionCardType[] = [];
  const groupBy: GroupByType[] = [];
  // build cards
  const workloads = Object.keys(scenario.scenario.workloads);
  workloads.forEach((workloadId) => {
    const workload = scenario.scenario.workloads[workloadId];
    const rules = workload.rule.rules;
    const conditions: ConditionRowType[] = [];
    rules.forEach((rule) => {
      const { value, operator, type, json_path, id } = rule;
      conditions.push({
        property: id,
        operator,
        value,
        datatype: type,
        key: nanoid(),
        json_path: json_path || [],
      });
    });
    let service = workload.service;
    if (workload.service.includes("*/*")) {
      service = `${workload.service}_${workload.protocol}`;
    }
    cards.push({
      rootProperty: service,
      conditions,
      protocol: workload.protocol,
      key: nanoid(),
    });
  });
  console.log({ scenario });

  scenario.scenario.group_by.forEach((group) => {
    const { title, workload_id } = group;
    const workload = scenario.scenario.workloads[workload_id];
    let service = workload.service;
    if (workload.service.includes("*/*")) {
      service = `${workload.service}_${workload.protocol}`;
    }
    groupBy.push({
      service,
      property: title,
      protocol: workload.protocol,
      key: nanoid(),
      executor: "OTEL",
    });
  });
  const title = scenario.scenario.scenario_title;
  const sample = scenario.scenario.rate_limit[0];
  const sampling: ProbeFormType["sampling"] = {
    samples: sample.bucket_max_size,
    duration: parseInt(
      sample.tick_duration.substring(0, sample.tick_duration.length - 1)
    ),
    metric: "m",
  };
  const form: ProbeFormType = {
    cards,
    groupBy,
    sampling,
    name: title,
    time: "1w",
  };
  return form;
};
