import { Skeleton } from "@mui/material";
import ExceptionTab from "components/ExceptionTab";
// import CodeBlock from "components/CodeBlock";
import PodTable from "components/PodTable";
import { nanoid } from "nanoid";
// import dynamic from "next/dynamic";
import {
  type GenericObject,
  type PodDetail,
  type SpanDetail,
  type SpanRawData,
  type SpanRawDataResponse,
} from "utils/types";

import {
  HTTP_REQUEST_BODY_KEYS,
  HTTP_REQUEST_HEADER_KEYS,
  HTTP_RESPONSE_BODY_KEYS,
  HTTP_RESPONSE_HEADER_KEYS,
  HTTP_TABS,
  OVERVIEW_KEYS,
  POD_KEYS,
} from "./IncidentInfoTabs.http";
import styles from "./IncidentInfoTabs.module.scss";
import {
  MYSQL_QUERY_KEYS,
  MYSQL_RESULT_KEYS,
  MYSQL_TABS,
} from "./IncidentInfoTabs.mysql";
// const ReactJson = dynamic(import("react-json-view"), { ssr: false });

export const DEFAULT_TAB_KEYS = [
  { label: "Overview", key: "overview" },
  { label: "Pods", key: "pods" },
];

export const ERROR_TAB_KEYS = [
  {
    label: "Exception",
    key: "exception",
  },
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
  podData: PodDetail[] | null,
  exceptionData: SpanRawDataResponse | null
) => {
  const DEFAULT_TAB_CONTENT = [
    {
      list: OVERVIEW_KEYS,
      valueObj: currentSpan,
    },
    {
      list: POD_KEYS,
      component: podData ? (
        <PodTable pods={podData} service={currentSpan.source} />
      ) : (
        <span>No pods found.</span>
      ),
    },
  ];
  const defaultKeys = [...DEFAULT_TAB_KEYS];
  const defaultContent: GenericObject[] = [...DEFAULT_TAB_CONTENT];
  if (currentSpan.exceptionParent && exceptionData) {
    defaultKeys.push(...ERROR_TAB_KEYS);
    defaultContent.push({
      list: ERROR_TAB_KEYS,
      component: <ExceptionTab exceptionSpan={exceptionData} />,
    });
  }

  switch (protocol) {
    case "http":
      return {
        keys: [...defaultKeys, ...HTTP_TABS],
        content: [
          ...defaultContent,
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
    case "mysql":
      return {
        keys: [...defaultKeys, ...MYSQL_TABS],
        content: [
          ...defaultContent,
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
        keys: [...defaultKeys, ...HTTP_TABS],
        content: [
          ...defaultContent,
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
  }
};
