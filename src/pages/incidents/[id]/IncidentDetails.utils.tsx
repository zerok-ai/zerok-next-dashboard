"use client";
import {
  HttpRequestDetail,
  HttpResponseDetail,
  IncidentDetail,
  SpanDetail,
  SpanMetadata,
} from "utils/types";
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
import React, { useEffect, useMemo, useState } from "react";
import { useFetch } from "hooks/useFetch";
import { GET_SPAN_METADTA_ENDPOINT } from "utils/endpoints";
import { SPAN_PROTOCOLS } from "utils/constants";
import ChipX from "components/themeX/ChipX";
import dynamic from "next/dynamic";
import objectPath from "object-path";
import { nanoid } from "@reduxjs/toolkit";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

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

export const INCIDENT_TAB_KEYS = ["overview", "request", "response"] as const;

export const INCIDENT_TABS: {
  label: string;
  key: (typeof INCIDENT_TAB_KEYS)[number];
}[] = [
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

export const OVERVIEW_KEYS: {
  label: string;
  key: string;
  render?: (val: any) => React.ReactNode;
}[] = [
  {
    label: "Protocol",
    key: "protocol",
    render: (value) => <ChipX label={value} />,
  },
  { label: "Source", key: "source" },
  { label: "Destination", key: "destination" },
  {
    label: "Latency",
    key: "latency_ms",
    render: (value) => `${value} ms`,
  },
  { label: "Status", key: "status" },
];

const REQUEST_KEYS = [
  {
    label: "Protocol",
    key: "protocol",
  },
  {
    label: "Method",
    key: "request_payload.req_method",
    render: (val: string) => <ChipX label={val} />,
  },
  { label: "Endpoint", key: "request_payload.req_path" },
  {
    label: "Request headers",
    key: "request_payload.req_headers",
    render: (val: string | null) => {
      const json = val ? JSON.parse(val) : null;
      return (
        <DynamicReactJson
          src={json}
          name={false}
          displayDataTypes={false}
          enableClipboard={false}
        />
      );
    },
  },
  {
    label: "Request body",
    key: "request_payload.req_body",
    render: (val: string | null) => {
      const json = val ? JSON.parse(val) : null;
      return json ? (
        <DynamicReactJson src={json} enableClipboard={false} />
      ) : (
        "null"
      );
    },
  },
];

const RESPONSE_KEYS = [
  {
    label: "Protocol",
    key: "protocol",
  },
  {
    label: "Method",
    key: "request_payload.req_method",
    render: (val: string) => <ChipX label={val} />,
  },
  { label: "Endpoint", key: "request_payload.req_path" },
  {
    label: "Response headers",
    key: "response_payload.resp_headers",
    render: (val: string | null) => {
      const json = val ? JSON.parse(val) : null;
      return (
        <DynamicReactJson
          src={json}
          name={false}
          displayDataTypes={false}
          enableClipboard={false}
        />
      );
    },
  },
  {
    label: "Response body",
    key: "response_payload.resp_body",
    render: (val: string | null) => {
      const json = val ? JSON.parse(val) : null;
      return json ? (
        <DynamicReactJson
          src={json}
          enableClipboard={false}
          name={false}
          displayDataTypes={false}
        />
      ) : (
        "null"
      );
    },
  },
];

export const IncidentTabs = ({
  selectedSpan,
}: {
  selectedSpan: null | SpanDetail;
}) => {
  const [activeTab, setActiveTab] = useState(INCIDENT_TABS[0].key);
  const {
    loading,
    error,
    data: rawSpanData,
    fetchData: fetchRawData,
  } = useFetch<SpanMetadata>(`spans.a799204ee3e76e31`);
  useEffect(() => {
    if (selectedSpan) {
      fetchRawData(GET_SPAN_METADTA_ENDPOINT);
    }
  }, [selectedSpan]);

  const TAB_CONTENT = useMemo(() => {
    return [
      {
        list: OVERVIEW_KEYS,
        valueObj: selectedSpan,
      },
      {
        list: REQUEST_KEYS,
        valueObj: rawSpanData,
      },
      {
        list: RESPONSE_KEYS,
        valueObj: rawSpanData,
      },
    ];
  }, [selectedSpan, rawSpanData]);

  return (
    <div className={styles["tabs-container"]}>
      <Tabs value={activeTab} onChange={(_, key) => setActiveTab(key)}>
        {INCIDENT_TABS.map((tab) => (
          <Tab key={tab.key} label={tab.label} value={tab.key} />
        ))}
      </Tabs>
      {/* tab content */}
      {selectedSpan && rawSpanData && (
        <div className={styles["tab-content-container"]}>
          {TAB_CONTENT.map((tab, index) => {
            if (tab.valueObj) {
              return (
                <div
                  className={cx(styles["tab-content"], styles["response-tab"])}
                  role="tabpanel"
                  hidden={activeTab !== INCIDENT_TAB_KEYS[index]}
                  key={nanoid()}
                >
                  {tab.list.map((obj) => {
                    const val = objectPath.get(
                      tab.valueObj as
                        | SpanDetail
                        | HttpRequestDetail
                        | HttpResponseDetail,
                      obj.key
                    ) as any;
                    return (
                      <div className={styles["tab-row"]} key={obj.key}>
                        <p className={styles["tab-row-label"]}>{obj.label}:</p>
                        <div className={styles["tab-row-value"]}>
                          {obj.render ? obj.render(val) : val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};
