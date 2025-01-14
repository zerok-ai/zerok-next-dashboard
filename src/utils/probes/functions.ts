import {
  type ConditionCardType,
  type ConditionRowType,
  type GroupByType,
  type ProbeFormType,
} from "components/forms/ProbeCreateForm/ProbeCreateForm.utils";
import { nanoid } from "nanoid";
import { type ScenarioDetail } from "utils/scenarios/types";

export const scenarioToProbeForm = (scenario: ScenarioDetail) => {
  const cards: ConditionCardType[] = [];
  const groupBy: GroupByType[] = [];
  // build cards
  const workloads = Object.keys(scenario.workloads);
  workloads.forEach((workloadId) => {
    const workload = scenario.workloads[workloadId];
    const rules = workload.rule.rules;
    const conditions: ConditionRowType[] = [];
    rules.forEach((rule) => {
      const { value, operator, json_path, id, input } = rule;
      conditions.push({
        property: id,
        operator,
        value,
        datatype: input,
        executor: workload.executor,
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

  scenario.group_by.forEach((group) => {
    const { title, workload_id } = group;
    const workload = scenario.workloads[workload_id];
    let service = workload.service;
    if (workload.service.includes("*/*")) {
      service = `${workload.service}_${workload.protocol}`;
    }
    groupBy.push({
      service,
      property: title,
      protocol: workload.protocol,
      key: nanoid(),
      executor: workload.executor,
    });
  });
  const title = scenario.scenario_title;
  const sample = scenario.rate_limit[0];
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

export const getServiceListFromScenario = (scenario: ScenarioDetail) => {
  const workloads = Object.keys(scenario.workloads);
  const services: string[] = [];
  workloads.forEach((workloadId) => {
    const workload = scenario.workloads[workloadId];
    let service = workload.service;
    if (workload.service.includes("*/*")) {
      service = `All ${workload.protocol} services`;
    }
    services.push(service);
  });
  return services;
};
