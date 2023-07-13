import { Skeleton } from "@mui/material";
import styles from "./IncidentInfoTabs.module.scss";
import {
  OVERVIEW_KEYS,
  HTTP_REQUEST_BODY_KEYS,
  HTTP_REQUEST_HEADER_KEYS,
  HTTP_RESPONSE_BODY_KEYS,
  HTTP_RESPONSE_HEADER_KEYS,
  HTTP_TABS,
  POD_KEYS,
} from "./IncidentInfoTabs.http";
import dynamic from "next/dynamic";
const ReactJson = dynamic(import("react-json-view"), { ssr: false });
import { GenericObject, PodDetail, SpanDetail, SpanRawData } from "utils/types";
import {
  MYSQL_QUERY_KEYS,
  MYSQL_RESULT_KEYS,
  MYSQL_TABS,
} from "./IncidentInfoTabs.mysql";
import { nanoid } from "nanoid";
import PodTable from "components/PodTable";
import CodeBlock from "components/CodeBlock";

export const DEFAULT_TAB_KEYS = [
  { label: "Overview", key: "overview" },
  { label: "Pods", key: "pods" },
];

export const ERROR_TAB_KEYS = [
  {
    label: "Exception",
    key: "request_payload.req_body",
    render: (value: string) => {
      try {
        const json = JSON.parse(value);
        return <ReactJson src={json} />;
      } catch (err) {
        return <CodeBlock code={value} allowCopy color="light" />;
      }
    },
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

  const ERROR_TAB_CONTENT = [
    {
      list: ERROR_TAB_KEYS,
      valueObj: rawSpanData,
    },
  ];
  let defaultKeys = [...DEFAULT_TAB_KEYS];
  let defaultContent: GenericObject[] = [...DEFAULT_TAB_CONTENT];
  switch (protocol) {
    case "http":
      console.log({ currentSpan });
      if (currentSpan.destination.includes("zk-client")) {
        defaultKeys.push(...ERROR_TAB_KEYS);
        defaultContent.push({
          list: ERROR_TAB_KEYS,
          valueObj: rawSpanData,
        });
      }
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
    case "MYSQL":
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
