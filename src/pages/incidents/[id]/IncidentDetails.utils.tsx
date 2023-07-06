import { IncidentDetail } from "utils/types";
import styles from "./IncidentDetailPage.module.scss";
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { BsCodeSlash } from "react-icons/bs";
import { getRelativeTime } from "utils/dateHelpers";
import { Drawer, IconButton, Tab, Tabs } from "@mui/material";

import cx from "classnames";
import cssVars from "styles/variables.module.scss";
import { useState } from "react";

export const IncidentMetadata = ({
  incident,
}: {
  incident: IncidentDetail;
}) => {
  return (
    <div className={styles["incident-metadata-container"]}>
      <span className={styles["incident-language-container"]}>
        <BsCodeSlash /> Java
      </span>
      <span className={styles["incident-time-container"]}>
        <AiOutlineClockCircle />{" "}
        <span>{getRelativeTime(incident.first_seen)}</span>
      </span>{" "}
      |
      <span className={styles["incident-time-container"]}>
        <AiOutlineClockCircle />{" "}
        <span>{getRelativeTime(incident.last_seen)}</span>
      </span>
    </div>
  );
};

export const SpanDrawerButton = ({ isOpen, toggleDrawer }) => {
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

export const INCIDENT_TABS = [
  {
    label: "Overview",
    key: "overview",
  },
  {
    label: "Request",
    key: "request",
  },
  {
    label: "Response",
    key: "response",
  },
];

export const IncidentTabs = () => {
  const [activeTab, setActiveTab] = useState(INCIDENT_TABS[0].key);
  return (
    <div className={styles["tabs-container"]}>
      <Tabs value={activeTab} onChange={(_, key) => setActiveTab(key)}>
        {INCIDENT_TABS.map((tab) => (
          <Tab key={tab.key} label={tab.label} value={tab.key} />
        ))}
      </Tabs>
    </div>
  );
};
