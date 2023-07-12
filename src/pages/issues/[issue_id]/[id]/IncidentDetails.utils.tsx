import {
  HttpRequestDetail,
  HttpResponseDetail,
  IssueDetail,
  SpanDetail,
  SpanRawData,
  SpanRawDataResponse,
  SpanResponse,
} from "utils/types";
import styles from "./IncidentDetailPage.module.scss";
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { BsCodeSlash } from "react-icons/bs";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import {
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Skeleton,
  Tab,
  Tabs,
} from "@mui/material";
import sjson from "secure-json-parse";

import cx from "classnames";
import cssVars from "styles/variables.module.scss";
import React, { useEffect, useMemo, useState } from "react";
import { useFetch } from "hooks/useFetch";
import { GET_SPAN_RAWDATA_ENDPOINT } from "utils/endpoints";
import ChipX from "components/themeX/ChipX";
import dynamic from "next/dynamic";
import objectPath from "object-path";
import { nanoid } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import { ICONS, ICON_BASE_PATH } from "utils/images";
import { useDispatch, useSelector } from "redux/store";
import { incidentListSelector, setIncidentList } from "redux/incidentList";
import axios from "axios";
import { clusterSelector } from "redux/cluster";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

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

export const INCIDENT_TAB_KEYS = [
  "overview",
  "request_headers",
  "request_body",
  "response_headers",
  "response_body",
] as const;

export const INCIDENT_TABS: {
  label: string;
  key: (typeof INCIDENT_TAB_KEYS)[number];
}[] = [
  {
    label: "Overview",
    key: "overview",
  },
  {
    label: "Request Headers",
    key: "request_headers",
  },
  {
    label: "Request Body",
    key: "request_body",
  },
  {
    label: "Response Headers",
    key: "response_headers",
  },
  {
    label: "Response Body",
    key: "response_body",
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

const REQUEST_HEADER_KEYS = [
  {
    label: "Method",
    key: "request_payload",
    render: (val: string) => <ChipX label={val} />,
  },
  { label: "Endpoint", key: "request_payload" },
  {
    label: "Request headers",
    key: "request_payload",
    render: (val: Object | null) => {
      const json = val || {};
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
];

const REQUEST_BODY_KEYS = [
  {
    label: "Method",
    // key: "request_payload.req_method",
    key: "request_payload",
    render: (val: string) => <ChipX label={val} />,
  },
  {
    label: "Request body",
    // key: "request_payload.req_body",
    key: "request_payload",
    // render: (val: string | null) => {
    //   const json = val || {};
    //   return json ? (
    //     <DynamicReactJson src={json} enableClipboard={false} />
    //   ) : (
    //     "null"
    //   );
    // },
  },
];

const RESPONSE_HEADER_KEYS = [
  {
    label: "Response headers",
    // key: "response_payload.resp_headers",
    key: "response_payload",
    // render: (val: string | null) => {
    //   const json = val || {};
    //   return (
    //     <DynamicReactJson
    //       src={json}
    //       name={false}
    //       displayDataTypes={false}
    //       enableClipboard={false}
    //     />
    //   );
    // },
  },
];

const RESPONSE_BODY_KEYS = [
  {
    label: "Response body",
    key: "response_payload",
    // render: (val: string | null) => {
    //   const json = val || {};
    //   return json ? (
    //     <DynamicReactJson
    //       src={json}
    //       enableClipboard={false}
    //       name={false}
    //       displayDataTypes={false}
    //     />
    //   ) : (
    //     "null"
    //   );
    // },
  },
];

const TabsSkeleton = () => {
  const headers = new Array(5).fill("header");
  const rows = new Array(5).fill("row");
  return (
    <div className={styles["tabs-skeleton-container"]}>
      <div className={styles["tabs-skeleton-header"]}>
        {headers.map((_) => {
          return <Skeleton className={styles["tabs-skeleton-header-item"]} />;
        })}
      </div>
      <div className={styles["tabs-skeleton-content"]}>
        {rows.map((_) => {
          return <Skeleton className={styles["tabs-skeleton-content-item"]} />;
        })}
      </div>
    </div>
  );
};

const IncidentTabs = ({
  selectedSpan,
  spanData,
}: {
  selectedSpan: null | string;
  spanData: null | SpanResponse;
}) => {
  const router = useRouter();
  const { issue_id, id: incidentId } = router.query;
  const [activeTab, setActiveTab] = useState(INCIDENT_TABS[0].key);
  const { selectedCluster } = useSelector(clusterSelector);
  const endpoint = GET_SPAN_RAWDATA_ENDPOINT.replace(
    "{cluster_id}",
    selectedCluster as string
  )
    .replace("{span_id}", selectedSpan as string)
    .replace("{incident_id}", incidentId as string)
    .replace("{issue_id}", issue_id as string);

  const {
    loading,
    error,
    data: rawSpanResponse,
    fetchData: fetchRawData,
  } = useFetch<SpanRawDataResponse>(`span_raw_data_details`);

  useEffect(() => {
    if (selectedSpan && selectedCluster && incidentId) {
      fetchRawData(endpoint);
    }
  }, [selectedSpan, endpoint]);
  const rawSpanData = rawSpanResponse
    ? rawSpanResponse[selectedSpan as string]
    : null;
  if (!selectedSpan || !rawSpanData || !spanData) {
    const headers = new Array(5).fill("header");
    const rows = new Array(5).fill("row");
    return (
      <div className={styles["tabs-skeleton-container"]}>
        <div className={styles["tabs-skeleton-header"]}>
          {headers.map((_) => {
            return <Skeleton className={styles["tabs-skeleton-header-item"]} />;
          })}
        </div>
        <div className={styles["tabs-skeleton-content"]}>
          {rows.map((_) => {
            return (
              <Skeleton className={styles["tabs-skeleton-content-item"]} />
            );
          })}
        </div>
      </div>
    );
  }

  console.log({ rawSpanData, spanData });

  if (rawSpanData.protocol === "http") {
    // try {
    //   rawSpanData.request_payload = sjson.parse(
    //     rawSpanData.request_payload as string
    //   );
    //   rawSpanData.response_payload = JSON.parse(
    //     rawSpanData.response_payload as string
    //   );
    // } catch (er) {
    //   console.log({ er });
    // }
  }
  const TAB_CONTENT = [
    {
      list: OVERVIEW_KEYS,
      valueObj: spanData[selectedSpan as string],
    },
    {
      list: REQUEST_HEADER_KEYS,
      valueObj: rawSpanData,
    },
    { list: REQUEST_BODY_KEYS, valueObj: rawSpanData },
    {
      list: RESPONSE_HEADER_KEYS,
      valueObj: rawSpanData,
    },
    { list: RESPONSE_BODY_KEYS, valueObj: rawSpanData },
  ];

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

export const IncidentNavButtons = () => {
  const { incidentList } = useSelector(incidentListSelector);
  const dispatch = useDispatch();
  const router = useRouter();
  if (!incidentList) return null;
  const { issue_id, id } = router.query;
  const basePath = `/issues/${issue_id}`;
  const activeIndex = incidentList.findIndex((incident) => incident === id);

  const fetchIncidentList = async () => {
    try {
      const rdata = await axios.get("/incident_ids.json");
      const list = rdata.data.payload.incidents;
      console.log({ list });
      router.push(`${basePath}/${list[0]}`);
      dispatch(setIncidentList([...incidentList, ...list]));
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

export default IncidentTabs;
