import { Skeleton } from "@mui/material";
import PageHeader from "components/helpers/PageHeader";
import TooltipX from "components/themeX/TooltipX";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { clusterSelector } from "redux/cluster";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { GET_ISSUE_ENDPOINT } from "utils/endpoints";
import { trimString } from "utils/functions";
import { getTitleFromIssue } from "utils/issues/functions";
import { type IssueDetail } from "utils/types";

import styles from "./IssueDetailPageHeader.module.scss";

export const IssueDetailPageHeader = () => {
  const { data: issue, fetchData: fetchIssue } = useFetch<IssueDetail>("issue");
  const router = useRouter();
  const { selectedCluster, clusters } = useSelector(clusterSelector);
  const issueId = router.query.issue_id;
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

  const IssueTimes = useMemo(() => {
    if (!issue) return null;
    return (
      <div className={styles.container}>
        <TooltipX title={`Cluster`} placement="bottom" arrow={false}>
          <span>{cluster!.name}</span>
        </TooltipX>
        |
        <AiOutlineClockCircle />{" "}
        <TooltipX
          title={`${getFormattedTime(issue.last_seen)}`}
          placement="bottom"
          arrow={false}
        >
          <span>Last collected - {getRelativeTime(issue.last_seen)}</span>
        </TooltipX>
        |
        <span className={styles["incident-time-container"]}>
          <TooltipX
            title={`${getFormattedTime(issue.first_seen)}`}
            placement="bottom"
            arrow={false}
          >
            <span>First collected - {getRelativeTime(issue.first_seen)}</span>
          </TooltipX>
        </span>
      </div>
    );
  }, [issue]);

  const displayTitle = issue
    ? getTitleFromIssue(issue.issue_title)
    : "Issue Detail";

  return issue ? (
    <PageHeader
      showBreadcrumb={true}
      title={trimString(displayTitle, 80)}
      showRange={false}
      showRefresh={false}
      bottomRow={IssueTimes}
      htmlTitle={displayTitle}
    />
  ) : (
    <div className={styles["skeleton-container"]}>
      <Skeleton variant="text" width={200} height={40} />
      <Skeleton variant="text" width={800} height={60} />
    </div>
  );
};

export default IssueDetailPageHeader;
