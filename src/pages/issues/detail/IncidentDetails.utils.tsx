import { Button, Skeleton, Tooltip } from "@mui/material";
import cx from "classnames";
import { useSticky } from "hooks/useSticky";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { clusterSelector } from "redux/cluster";
import { drawerSelector } from "redux/drawer";
import { incidentListSelector, setIncidentList } from "redux/incidentList";
import { useDispatch, useSelector } from "redux/store";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { GET_INCIDENTS_ENDPOINT } from "utils/endpoints";
import { ICON_BASE_PATH, ICONS } from "utils/images";
import raxios from "utils/raxios";
import {
  GET_SCENARIO_DETAILS_ENDPOINT,
  LIST_SCENARIOS_ENDPOINT,
} from "utils/scenarios/endpoints";
import { type ScenarioDetail } from "utils/scenarios/types";

import styles from "./IncidentDetailPage.module.scss";

export const IncidentNavButtons = ({ max }: { max: number }) => {
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
    if (activeIndex <= incidentList.length - 1) {
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
        disabled={activeIndex >= max - 1}
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
  // const { data: issue, fetchData } = useFetch<IssueDetail>("issue");
  const [scenario, setScenario] = useState<null | ScenarioDetail>(null);
  const [metadata, setMetadata] = useState<null | ScenarioDetail>(null);
  const router = useRouter();
  const { selectedCluster } = useSelector(clusterSelector);
  const issueId = router.query.issue;

  // const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  // Fetch issue data on mount
  useEffect(() => {
    if (issueId && selectedCluster) {
      raxios
        .get(LIST_SCENARIOS_ENDPOINT, {
          headers: {
            "Cluster-Id": selectedCluster,
          },
        })
        .then((res) => {
          const data = res.data.payload.scenarios.find(
            (sc: ScenarioDetail) => sc.scenario_id === issueId
          );
          if (data) setScenario(data);
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  }, [issueId, selectedCluster]);

  useEffect(() => {
    if (scenario && selectedCluster) {
      const endpoint = GET_SCENARIO_DETAILS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{scenario_id_list}", scenario.scenario_id)
        .replace("{range}", "-1d");
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

  const { isDrawerMinimized } = useSelector(drawerSelector);
  // Sticky header boolean and ref
  const { isSticky, stickyRef } = useSticky();
  return scenario ? (
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
        <h3>{scenario.scenario_title}</h3>
        {metadata && (
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
        )}
      </div>
    </div>
  ) : (
    <Skeleton className={"page-title-loader"} />
  );
};
