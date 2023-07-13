import { Skeleton } from "@mui/material";
import styles from "./IncidentInfoTabs.module.scss";
import {
  OVERVIEW_KEYS,
  HTTP_REQUEST_BODY_KEYS,
  HTTP_REQUEST_HEADER_KEYS,
  HTTP_RESPONSE_BODY_KEYS,
  HTTP_RESPONSE_HEADER_KEYS,
  HTTP_TABS,
  HTTP_TAB_KEYS,
  POD_KEYS,
} from "./IncidentInfoTabs.http";
import { PodDetail, SpanDetail, SpanRawData } from "utils/types";
import {
  MYSQL_OVERVIEW_KEYS,
  MYSQL_QUERY_KEYS,
  MYSQL_RESULT_KEYS,
  MYSQL_TABS,
  MYSQL_TAB_KEYS,
} from "./IncidentInfoTabs.mysql";
import { nanoid } from "nanoid";
import PodTable from "components/PodTable";

export const DEFAULT_TAB_KEYS = [
  { label: "Overview", key: "overview" },
  { label: "Pods", key: "pods" },
];

export const TabSkeleton = () => {
  const headers = new Array(5).fill("header");
  const rows = new Array(5).fill("row");
  return (
    <div className={styles["tabs-skeleton-container"]}>
      <div className={styles["tabs-skeleton-header"]}>
        {headers.map((_) => {
          return (
            <Skeleton
              className={styles["tabs-skeleton-header-item"]}
              key={nanoid()}
            />
          );
        })}
      </div>
      <div className={styles["tabs-skeleton-content"]}>
        {rows.map((_) => {
          return (
            <Skeleton
              className={styles["tabs-skeleton-content-item"]}
              key={nanoid()}
            />
          );
        })}
      </div>
    </div>
  );
};

export const getTabByProtocol = (
  protocol: string,
  currentSpan: SpanDetail,
  rawSpanData: SpanRawData,
  podData: PodDetail[]
) => {
  const DEFAULT_TAB_CONTENT = [
    {
      list: OVERVIEW_KEYS,
      valueObj: currentSpan,
    },
    {
      list: POD_KEYS,
      component: <PodTable pods={podData} service={currentSpan.source} />,
    },
  ];
  switch (protocol) {
    case "http":
      return {
        keys: [...DEFAULT_TAB_KEYS, ...HTTP_TABS],
        content: [
          ...DEFAULT_TAB_CONTENT,
          {
            list: HTTP_REQUEST_HEADER_KEYS,
            valueObj: rawSpanData,
          },
          {
            list: HTTP_REQUEST_BODY_KEYS,
            valueObj: rawSpanData,
          },
          {
            list: HTTP_RESPONSE_HEADER_KEYS,
            valueObj: rawSpanData,
          },
          {
            list: HTTP_RESPONSE_BODY_KEYS,
            valueObj: rawSpanData,
          },
        ],
      };
    case "MYSQL":
      return {
        keys: [...DEFAULT_TAB_KEYS, ...MYSQL_TABS],
        content: [
          ...DEFAULT_TAB_CONTENT,
          {
            list: MYSQL_QUERY_KEYS,
            valueObj: rawSpanData,
          },
          {
            list: MYSQL_RESULT_KEYS,
            valueObj: rawSpanData,
          },
        ],
      };
    default:
      return {
        keys: HTTP_TABS,
        content: [
          {
            list: HTTP_REQUEST_HEADER_KEYS,
            valueObj: rawSpanData,
          },
          {
            list: HTTP_REQUEST_BODY_KEYS,
            valueObj: rawSpanData,
          },
          {
            list: HTTP_RESPONSE_HEADER_KEYS,
            valueObj: rawSpanData,
          },
          {
            list: HTTP_REQUEST_BODY_KEYS,
            valueObj: rawSpanData,
          },
        ],
      };
  }
};
