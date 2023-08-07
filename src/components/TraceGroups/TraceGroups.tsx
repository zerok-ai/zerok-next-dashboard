import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import CustomSkeleton from "components/CustomSkeleton";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { HiChevronRight } from "react-icons/hi2";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { getRelativeTime } from "utils/dateHelpers";
import { TRACE_GROUP_PAGE_SIZE } from "utils/scenarios/constants";
import { GET_TRACE_GROUPS_ENDPOINT } from "utils/scenarios/endpoints";
import { type IssueDetail } from "utils/types";

import styles from "./TraceGroups.module.scss";

const TraceGroups = () => {
  const { data: traceGroups, fetchData: fetchTraceGroups } =
    useFetch<IssueDetail[]>("issues");
  const router = useRouter();
  const range = (router.query.range as string) ?? DEFAULT_TIME_RANGE;
  const scenarioID = router.query.issue;
  const { selectedCluster } = useSelector((state) => state.cluster);

  useEffect(() => {
    if (selectedCluster && scenarioID) {
      const endpoint = GET_TRACE_GROUPS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{limit}", TRACE_GROUP_PAGE_SIZE.toString())
        .replace("{range}", range)
        .replace("{offset}", "0")
        .replace("{scenario_id}", scenarioID as string);
      fetchTraceGroups(endpoint);
    }
  }, [selectedCluster, scenarioID]);

  const AccordionIcon = useMemo(() => {
    return <HiChevronRight />;
  }, []);
  const getLink = (issue: IssueDetail) => {
    return `/issues/detail?issue=${scenarioID as string}&issue_id=${
      issue.issue_hash
    }`;
  };
  const renderGroup = (levels: string[], group: IssueDetail) => {
    if (!levels.length) {
      return renderGroupCard(group);
    }
    const lvl = levels[0];
    return (
      <Accordion
        key={nanoid()}
        defaultExpanded={true}
        className={styles.accordion}
      >
        <AccordionSummary
          className={styles["accordion-summary"]}
          expandIcon={AccordionIcon}
        >
          <span
            className={styles["accordion-summary-content"]}
            role="button"
            onClick={() => {
              router.push(getLink(group));
            }}
          >
            {lvl}
          </span>
        </AccordionSummary>
        <AccordionDetails className={styles["accordion-details"]}>
          {renderGroup(levels.slice(1), group)}
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderGroupCard = (group: IssueDetail) => {
    return (
      <Link href={getLink(group)}>
        <div className={styles["group-card-container"]}>
          <div className={styles["group-card"]}>
            <div className={styles["group-row"]}>
              <div className={styles.key}>Service:</div>
              <div className={styles.value}>
                {group.sources.filter((src) => src.length > 0)[0]}
              </div>
            </div>
            <div className={styles["group-row"]}>
              <div className={styles.key}>First seen:</div>
              <div className={styles.value}>
                {getRelativeTime(group.first_seen)}
              </div>
            </div>
            <div className={styles["group-row"]}>
              <div className={styles.key}>Last seen:</div>
              <div className={styles.value}>
                {getRelativeTime(group.last_seen)}
              </div>
            </div>
            <div className={styles["group-row"]}>
              <div className={styles.key}>Total count:</div>
              <div className={styles.value}>{group.total_count}</div>
            </div>
            <div className={styles["group-row"]}>
              <div className={styles.key}>Velocity:</div>
              <div className={styles.value}>{group.velocity}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h6>Grouped by:</h6>
      </div>
      <div className={styles.groups}>
        {traceGroups && traceGroups.length > 0 ? (
          traceGroups.map((tr) => {
            const levels = tr.issue_title.split("¦").slice(1);
            if (levels.length === 1) {
              return renderGroupCard(tr);
            }
            return renderGroup(levels, tr);
          })
        ) : (
          <CustomSkeleton len={5} />
        )}
      </div>
    </div>
  );
};

export default TraceGroups;
