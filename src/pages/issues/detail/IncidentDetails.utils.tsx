import { Skeleton, Tooltip } from "@mui/material";
import PageHeader from "components/helpers/PageHeader";
import TooltipX from "components/themeX/TooltipX";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { GET_ISSUE_ENDPOINT } from "utils/endpoints";
import { trimString } from "utils/functions";
import { getTitleFromIssue } from "utils/issues/functions";
import { type IssueDetail } from "utils/types";

import styles from "./IncidentDetailPage.module.scss";

export const IssueMetadata = () => {
  // const { data: issue, fetchData } = useFetch<IssueDetail>("issue");
  const { data: issue, fetchData: fetchIssue } = useFetch<IssueDetail>("issue");
  const router = useRouter();
  const { selectedCluster, clusters } = useSelector(clusterSelector);
  const issueId = router.query.issue_id;

  // const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  // Fetch issue data on mount
  useEffect(() => {
    if (router.isReady && issueId && selectedCluster) {
      const endpoint = GET_ISSUE_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      ).replace("{issue_id}", issueId as string);
      fetchIssue(endpoint);
    }
  }, [selectedCluster, issueId, router]);

  const cluster = clusters.find((c) => c.id === selectedCluster);
  console.log({ issueId, selectedCluster, clusters, issue });

  const IssueTimes = () => {
    if (!issue) return null;
    return (
      <div className={styles["incident-metadata-container"]}>
        <TooltipX title={`Cluster`} placement="bottom" arrow>
          <span>{cluster!.name}</span>
        </TooltipX>
        |
        <AiOutlineClockCircle />{" "}
        <Tooltip
          title={`${getFormattedTime(issue.last_seen)}`}
          placement="bottom"
          arrow
        >
          <span>Last collected - {getRelativeTime(issue.last_seen)}</span>
        </Tooltip>
        |
        <span className={styles["incident-time-container"]}>
          <Tooltip
            title={`${getFormattedTime(issue.first_seen)}`}
            placement="bottom"
            arrow
          >
            <span>First collected - {getRelativeTime(issue.first_seen)}</span>
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
