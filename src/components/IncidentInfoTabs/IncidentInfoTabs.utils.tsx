import { Skeleton } from "@mui/material";
import styles from "./IncidentInfoTabs.module.scss";
import {
  HTTP_OVERVIEW_KEYS,
  HTTP_REQUEST_BODY_KEYS,
  HTTP_REQUEST_HEADER_KEYS,
  HTTP_RESPONSE_BODY_KEYS,
  HTTP_RESPONSE_HEADER_KEYS,
  HTTP_TABS,
  HTTP_TAB_KEYS,
} from "./IncidentInfoTabs.http";
import { SpanDetail, SpanRawData } from "utils/types";
export const DEFAULT_TAB = "overview";

export const TabSkeleton = () => {
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

export const getTabByProtocol = (
  protocol: string,
  currentSpan: SpanDetail,
  rawSpanData: SpanRawData
) => {
  switch (protocol) {
    case "http":
      return {
        keys: HTTP_TABS,
        content: [
          {
            list: HTTP_OVERVIEW_KEYS,
            valueObj: currentSpan,
          },
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
    default:
      return {
        keys: HTTP_TABS,
        content: [
          {
            list: HTTP_OVERVIEW_KEYS,
            valueObj: currentSpan,
          },
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
