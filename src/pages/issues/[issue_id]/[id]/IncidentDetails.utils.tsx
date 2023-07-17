import { IssueDetail, SpanDetail } from "utils/types";
import styles from "./IncidentDetailPage.module.scss";
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { Button, Drawer, IconButton } from "@mui/material";

import cx from "classnames";
import cssVars from "styles/variables.module.scss";
import { GET_INCIDENTS_ENDPOINT } from "utils/endpoints";
import { useRouter } from "next/router";
import { ICONS, ICON_BASE_PATH } from "utils/images";
import { useDispatch, useSelector } from "redux/store";
import { incidentListSelector, setIncidentList } from "redux/incidentList";
import { clusterSelector } from "redux/cluster";
import raxios from "utils/raxios";

export const IncidentMetadata = ({ incident }: { incident: IssueDetail }) => {
  return (
    <div className={styles["incident-metadata-container"]}>
      {/* <span className={styles["incident-language-container"]}>
        <BsCodeSlash /> Java
      </span> */}
      <span className={styles["incident-time-container"]}>
        <span>{getFormattedTime(incident.first_seen)}</span>
      </span>{" "}
      |
      <span className={styles["incident-time-container"]}>
        <AiOutlineClockCircle />{" "}
        <span>{getRelativeTime(incident.last_seen)}</span>
      </span>
    </div>
  );
};

export const SpanDrawerButton = ({
  isOpen,
  toggleDrawer,
}: {
  isOpen: boolean;
  toggleDrawer: () => void;
}) => {
  return (
    <IconButton
      size="medium"
      className={cx(styles["drawer-btn"], isOpen && styles["drawer-btn-open"])}
      onClick={toggleDrawer}
    >
      {isOpen ? (
        <AiFillCaretLeft className={styles["drawer-btn-icon"]} />
      ) : (
        <AiFillCaretRight className={styles["drawer-btn-icon"]} />
      )}
    </IconButton>
  );
};

export const SpanDetailDrawer = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Drawer
      open={isOpen}
      anchor="left"
      className={styles["drawer"]}
      PaperProps={{
        style: {
          position: "absolute",
          width: cssVars.incidentDrawerWidth,
          background: cssVars.backgroundDark,
        },
      }}
      ModalProps={{
        container: document.getElementById("map-drawer-container"),
        style: { position: "absolute" },
      }}
      SlideProps={{
        onExiting: (node) => {
          node.style.webkitTransform = "scaleX(0)";
          node.style.transform = "scaleX(0)";
          node.style.transformOrigin = "top left ";
        },
      }}
      hideBackdrop
    >
      {children}
    </Drawer>
  );
};

export const IncidentNavButtons = () => {
  const { selectedCluster } = useSelector(clusterSelector);
  const { incidentList } = useSelector(incidentListSelector);
  const dispatch = useDispatch();
  const router = useRouter();
  if (!incidentList) return null;
  const { issue_id, id } = router.query;
  const basePath = `/issues/${issue_id}`;
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
      router.push(`${basePath}/${list[0]}`);
    } catch (err) {
      console.log({ err });
    }
  };

  const getNewer = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      router.push(`${basePath}/${incidentList[newIndex]}`);
    }
  };

  const getOlder = () => {
    if (activeIndex < incidentList.length - 1) {
      const newIndex = activeIndex + 1;
      router.push(`${basePath}/${incidentList[newIndex]}`);
    } else {
      fetchIncidentList();
    }
  };

  return (
    <div className={styles["incident-nav-buttons-container"]}>
      {/* Newest */}
      {/* <IconButton className={styles["incident-nav-iconbutton"]} size="large">
        <img src={`${ICON_BASE_PATH}/${ICONS["two-arrows-left"]}`} />
      </IconButton> */}
      {/* Newer */}
      <Button
        className={styles["incident-nav-button"]}
        variant="outlined"
        color="secondary"
        size="medium"
        disabled={activeIndex === 0}
        onClick={() => getNewer()}
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
        onClick={() => getOlder()}
      >
        Older{" "}
        <span className={styles["incident-nav-button-icon"]}>
          <img src={`${ICON_BASE_PATH}/${ICONS["chevron-right"]}`} />
        </span>
      </Button>
      {/* Oldest */}
      {/* <IconButton
        color="secondary"
        className={styles["incident-nav-iconbutton"]}
        size="large"
      >
        <img src={`${ICON_BASE_PATH}/${ICONS["two-arrows-right"]}`} />
      </IconButton> */}
    </div>
  );
};

export default IncidentNavButtons;

export const buildSpanTree = (
  spans: SpanDetail[],
  parentSpan: SpanDetail,
  level: number = 0
) => {
  if (!spans.length) {
    return parentSpan;
  }
  const childrenSpan = spans.filter(
    (span) => span.parent_span_id === parentSpan.span_id
  );
  if (childrenSpan.length) {
    parentSpan.children = childrenSpan;
    ++level;
    childrenSpan.map((span) => {
      span.level = level;
      return buildSpanTree(spans, span, level);
    });
  }
  return { ...parentSpan };
};
