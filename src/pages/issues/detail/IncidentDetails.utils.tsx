import { Skeleton, Tooltip } from "@mui/material";
import PageHeader from "components/helpers/PageHeader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import raxios from "utils/raxios";
import {
  GET_SCENARIO_DETAILS_ENDPOINT,
  LIST_SCENARIOS_ENDPOINT,
} from "utils/scenarios/endpoints";
import { type ScenarioDetail } from "utils/scenarios/types";

import styles from "./IncidentDetailPage.module.scss";

export const IssueMetadata = () => {
  // const { data: issue, fetchData } = useFetch<IssueDetail>("issue");
  const [scenario, setScenario] = useState<null | ScenarioDetail>(null);
  const [metadata, setMetadata] = useState<null | ScenarioDetail>(null);
  const router = useRouter();
  const { selectedCluster } = useSelector(clusterSelector);
  const scenarioId = router.query.issue;
  const range = router.query.range ?? DEFAULT_TIME_RANGE;

  // const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  // Fetch issue data on mount
  useEffect(() => {
    if (scenarioId && selectedCluster) {
      raxios
        .get(LIST_SCENARIOS_ENDPOINT, {
          headers: {
            "Cluster-Id": selectedCluster,
          },
        })
        .then((res) => {
          const data = res.data.payload.scenarios.find(
            (sc: ScenarioDetail) => sc.scenario_id === scenarioId
          );
          setScenario(data);
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  }, [scenarioId, selectedCluster]);

  useEffect(() => {
    if (scenario && selectedCluster) {
      const endpoint = GET_SCENARIO_DETAILS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{scenario_id_list}", scenario.scenario_id)
        .replace("{range}", range as string);
      raxios
        .get(endpoint)
        .then((res) => {
          const data = res.data.payload.scenarios[0];
          if (data) setMetadata(data);
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  }, [scenario, selectedCluster]);

  const IssueTimes = () => {
    if (!metadata) return null;
    return (
      <div className={styles["incident-metadata-container"]}>
        <Tooltip
          title={`Last seen: ${getFormattedTime(metadata.last_seen)}`}
          placement="bottom"
          arrow
        >
          <span>{getRelativeTime(metadata.last_seen)}</span>
        </Tooltip>
        |
        <span className={styles["incident-time-container"]}>
          <AiOutlineClockCircle />{" "}
          <Tooltip
            title={`First seen: ${getFormattedTime(metadata.first_seen)}`}
            placement="bottom"
            arrow
          >
            <span>{getRelativeTime(metadata.first_seen)}</span>
          </Tooltip>
        </span>
      </div>
    );
  };

  return scenario ? (
    <div className={styles["header-left"]}>
      {" "}
      <PageHeader
        showBreadcrumb={true}
        title={scenario.scenario_title}
        showRange={false}
        align="right"
        showRefresh={false}
        bottomRow={<IssueTimes />}
      />
    </div>
  ) : (
    <Skeleton className={"page-title-loader"} />
  );
};

export default IssueMetadata;
