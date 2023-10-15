import { Skeleton, Tooltip } from "@mui/material";
import PageHeader from "components/helpers/PageHeader";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { GET_ISSUE_ENDPOINT } from "utils/endpoints";
import { trimString } from "utils/functions";
import { getTitleFromIssue } from "utils/issues/functions";
import raxios from "utils/raxios";
import { GET_SCENARIO_DETAILS_ENDPOINT } from "utils/scenarios/endpoints";
import { type ScenarioDetail } from "utils/scenarios/types";
import { type IssueDetail } from "utils/types";

import styles from "./IncidentDetailPage.module.scss";

export const IssueMetadata = () => {
  // const { data: issue, fetchData } = useFetch<IssueDetail>("issue");
  const { data: issue, fetchData: fetchIssue } = useFetch<IssueDetail>("issue");
  const [metadata, setMetadata] = useState<null | ScenarioDetail>(null);
  const router = useRouter();
  const { selectedCluster } = useSelector(clusterSelector);
  const scenarioId = router.query.issue;
  const issueId = router.query.issue_id;
  const range = router.query.range ?? DEFAULT_TIME_RANGE;

  // const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  // Fetch issue data on mount
  useEffect(() => {
    if (scenarioId && selectedCluster) {
      const endpoint = GET_ISSUE_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      ).replace("{issue_id}", issueId as string);
      fetchIssue(endpoint);
    }
  }, [scenarioId, selectedCluster]);

  useEffect(() => {
    if (selectedCluster) {
      const endpoint = GET_SCENARIO_DETAILS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{scenario_id_list}", scenarioId as string)
        .replace("{range}", range as string);
      raxios
        .get(endpoint)
        .then((res) => {
          const data = res.data.payload.scenarios[0];
          if (data) setMetadata(data);
        })
        .catch((err) => {
          console.error({ err });
        });
    }
  }, [issue, selectedCluster]);

  const IssueTimes = () => {
    if (!metadata) return null;
    return (
      <div className={styles["incident-metadata-container"]}>
        <Tooltip
          title={`${getFormattedTime(metadata.last_seen)}`}
          placement="bottom"
          arrow
        >
          <span>Last collected - {getRelativeTime(metadata.last_seen)}</span>
        </Tooltip>
        |
        <span className={styles["incident-time-container"]}>
          <AiOutlineClockCircle />{" "}
          <Tooltip
            title={`${getFormattedTime(metadata.first_seen)}`}
            placement="bottom"
            arrow
          >
            <span>
              First collected - {getRelativeTime(metadata.first_seen)}
            </span>
          </Tooltip>
        </span>
      </div>
    );
  };

  return issue ? (
    <div className={styles["header-left"]}>
      {" "}
      <PageHeader
        showBreadcrumb={true}
        title={trimString(getTitleFromIssue(issue.issue_title), 80)}
        showRange={false}
        showRefresh={false}
        bottomRow={<IssueTimes />}
      />
    </div>
  ) : (
    <Skeleton className={"page-title-loader"} />
  );
};

export default IssueMetadata;
