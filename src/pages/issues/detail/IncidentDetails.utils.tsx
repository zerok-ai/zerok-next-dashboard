import { Button, Skeleton, Tooltip } from "@mui/material";
import cx from "classnames";
import { useFetch } from "hooks/useFetch";
import { useSticky } from "hooks/useSticky";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { clusterSelector } from "redux/cluster";
import { drawerSelector } from "redux/drawer";
import { incidentListSelector, setIncidentList } from "redux/incidentList";
import { dispatch, useDispatch, useSelector } from "redux/store";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { GET_INCIDENTS_ENDPOINT, GET_ISSUE_ENDPOINT } from "utils/endpoints";
import { ICON_BASE_PATH, ICONS } from "utils/images";
import raxios from "utils/raxios";
import {
  type IssueDetail,
  type SpanDetail,
  type SpanResponse,
} from "utils/types";

import styles from "./IncidentDetailPage.module.scss";

export const IncidentNavButtons = () => {
  const { selectedCluster } = useSelector(clusterSelector);
  const { incidentList } = useSelector(incidentListSelector);
  const dispatch = useDispatch();
  const router = useRouter();
  const { issue: issue_id, incident: id } = router.query;
  if (incidentList.length === 0 || issue_id === undefined) return null;
  const basePath = `/issues/detail?issue=${issue_id as string}`;
  const activeIndex = incidentList.findIndex((incident) => incident === id);
  const fetchIncidentList = async () => {
    try {
      const endpoint = GET_INCIDENTS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      )
        .replace("{issue_id}", issue_id as string)
        .replace("{offset}", incidentList.length.toString());
      const rdata = await raxios.get(endpoint);
      const list = rdata.data.payload.trace_id_list;
      dispatch(setIncidentList([...incidentList, ...list]));
      router.push(`${basePath}/${list[0] as string}`);
    } catch (err) {
      // console.log({ err });
    }
  };

  const getNewer = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      router.push(`${basePath}&incident=${incidentList[newIndex]}`);
    }
  };

  const getOlder = () => {
    if (activeIndex < incidentList.length - 1) {
      const newIndex = activeIndex + 1;
      router.push(`${basePath}&incident=${incidentList[newIndex]}`);
    } else {
      fetchIncidentList();
    }
  };

  return (
    <div className={styles["incident-nav-buttons-container"]}>
      <Button
        className={styles["incident-nav-button"]}
        variant="outlined"
        color="secondary"
        size="medium"
        disabled={activeIndex === 0}
        onClick={() => {
          getNewer();
        }}
      >
        Newer{" "}
        <span className={styles["incident-nav-button-icon"]}>
          <img src={`${ICON_BASE_PATH}/${ICONS["chevron-left"]}`} />
        </span>
      </Button>
      {/* Older */}
      <Button
        color="secondary"
        variant="outlined"
        size="medium"
        className={styles["incident-nav-button"]}
        onClick={() => {
          getOlder();
        }}
      >
        Older{" "}
        <span className={styles["incident-nav-button-icon"]}>
          <img src={`${ICON_BASE_PATH}/${ICONS["chevron-right"]}`} />
        </span>
      </Button>
    </div>
  );
};

export default IncidentNavButtons;

export const IssueMetadata = () => {
  const { data: issue, fetchData } = useFetch<IssueDetail>("issue");
  const router = useRouter();
  const { selectedCluster } = useSelector(clusterSelector);
  const issueId = router.query.issue;

  // const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  // Fetch issue data on mount
  useEffect(() => {
    if (issueId !== undefined && selectedCluster) {
      fetchData(
        GET_ISSUE_ENDPOINT.replace("{cluster_id}", selectedCluster).replace(
          "{issue_id}",
          issueId as string
        )
      );
    }
  }, [issueId, selectedCluster]);

  useEffect(() => {
    if (issue) {
      dispatch(setIncidentList(issue.incidents));
    }
  }, [issue]);

  const { isDrawerMinimized } = useSelector(drawerSelector);
  // Sticky header boolean and ref
  const { isSticky, stickyRef } = useSticky();

  return issue ? (
    <div
      className={cx(
        styles.header,
        isSticky && styles.sticky,
        isDrawerMinimized && styles["drawer-minimized"]
      )}
      id="incident-header"
      ref={stickyRef}
    >
      <div className={styles["header-left"]}>
        {" "}
        <h3>{issue.issue_title}</h3>
        <div className={styles["incident-metadata-container"]}>
          <Tooltip
            title={`Last seen: ${getFormattedTime(issue.last_seen)}`}
            placement="bottom"
            arrow
          >
            <span>{getRelativeTime(issue.last_seen)}</span>
          </Tooltip>
          |
          <span className={styles["incident-time-container"]}>
            <AiOutlineClockCircle />{" "}
            <Tooltip
              title={`First seen: ${getFormattedTime(issue.first_seen)}`}
              placement="bottom"
              arrow
            >
              <span>{getRelativeTime(issue.first_seen)}</span>
            </Tooltip>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <Skeleton className={"page-title-loader"} />
  );
};

export const buildSpanTree = (
  spans: SpanResponse,
  parentSpan: SpanDetail,
  level: number = 0
) => {
  const keys = Object.keys(spans);
  if (keys.length === 0) {
    return parentSpan;
  }
  const childrenSpan: SpanDetail[] = [];
  keys.forEach((key) => {
    const span = spans[key];
    if (span.parent_span_id === parentSpan.span_id) {
      childrenSpan.push(span);
    }
  });

  if (childrenSpan.length > 0) {
    parentSpan.children = childrenSpan;
    ++level;
    childrenSpan.map((span) => {
      span.level = level;
      return buildSpanTree(spans, span, level);
    });
  }
  return { ...parentSpan };
};
