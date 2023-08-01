import cx from "classnames";
import CodeBlock from "components/CodeBlock";
import SQLRawTable from "components/SQLRawTable";
import ChipX from "components/themeX/ChipX";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { getFormattedTime } from "utils/dateHelpers";
import {
  convertNanoToMilliSeconds,
  stringWithoutComments,
} from "utils/functions";
import {
  type HttpRequestDetail,
  type HttpResponseDetail,
  type SpanDetail,
  type SpanRawData,
} from "utils/types";

import styles from "./TraceInfoTabs.module.scss";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

export interface TabKeyType {
  label: string;
  value: string;
  customRender?: () => React.ReactNode;
  fullWidth?: boolean;
}

export const renderListOfKeyValue = (list: TabKeyType[]) => {
  return (
    <div className={styles["key-value-container"]}>
      {list.map((key) => {
        const renderKey = key.customRender ? key.customRender() : key.value;
        return (
          <div
            className={cx(
              styles["key-value-row"],
              key.fullWidth && styles["full-width"]
            )}
            key={nanoid()}
          >
            {!key.fullWidth && (
              <p className={styles["key-value-key"]}>{key.label}:</p>
            )}
            <p className={styles["key-value-value"]}>{renderKey}</p>
          </div>
        );
      })}
    </div>
  );
};

export const renderJSON = (val: string) => {
  try {
    const parsed = JSON.parse(val);

    return typeof parsed === "object" ? (
      <DynamicReactJson src={parsed} />
    ) : (
      <CodeBlock code={parsed.toString()} allowCopy color="light" />
    );
  } catch (err) {
    console.log("HERE");
  }
  return <p>{val.length ? val : `{ }`}</p>;
};

export const DEFAULT_TABS = [
  {
    label: "Overview",
    value: "overview",
    render: (metadata: SpanDetail) => {
      const KEYS = [
        {
          label: "Protocol",
          value: metadata.protocol,
          customRender: () => {
            return <ChipX label={metadata.protocol} />;
          },
        },
        {
          label: "Source",
          value: metadata.source,
        },
        {
          label: "Destination",
          value: metadata.destination,
        },
        {
          label: "Latency",
          value: convertNanoToMilliSeconds(metadata.latency_ns),
        },
        {
          label: "Timestamp",
          value: getFormattedTime(metadata.time),
        },
        {
          label: "Status",
          value: metadata.status,
        },
      ];
      return renderListOfKeyValue(KEYS);
    },
  },
];

export const HTTP_TABS = [
  {
    label: "Request headers",
    value: "request_header",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const req = rawData.request_payload as HttpRequestDetail;
      const KEYS = [
        {
          label: "Method",
          value: req.req_method,
          customRender: () => {
            return <ChipX label={req.req_method} />;
          },
        },
        {
          label: "Path",
          value: req.req_path,
        },
        {
          label: "Request headers",
          value: req.req_headers as string,
          customRender: () => {
            return renderJSON(req.req_headers as string);
          },
        },
      ];
      return renderListOfKeyValue(KEYS);
    },
  },
  {
    label: "Request body",
    value: "request_body",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const req = rawData.request_payload as HttpRequestDetail;
      const KEYS = [
        {
          label: "Method",
          value: req.req_method,
          customRender: () => {
            return <ChipX label={req.req_method} />;
          },
        },
        {
          label: "Path",
          value: req.req_path,
        },
        {
          label: "Request body",
          value: req.req_body as string,
          customRender: () => {
            return renderJSON(req.req_body as string);
          },
        },
      ];
      return renderListOfKeyValue(KEYS);
    },
  },
  {
    label: "Response header",
    value: "response_header",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const res = rawData.response_payload as unknown as HttpResponseDetail;
      const KEYS = [
        {
          label: "Status",
          value: res.resp_status,
        },
        {
          label: "Response headers",
          value: res.resp_headers as string,
          customRender: () => {
            return renderJSON(res.resp_headers as string);
          },
        },
      ];
      return renderListOfKeyValue(KEYS);
    },
  },
  {
    label: "Response body",
    value: "response_body",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const res = rawData.response_payload as unknown as HttpResponseDetail;
      const KEYS = [
        {
          label: "Response body",
          fullWidth: true,
          value: res.resp_body as string,
          customRender: () => {
            return renderJSON(res.resp_body as string);
          },
        },
      ];
      return renderListOfKeyValue(KEYS);
    },
  },
];

export const MYSQL_TABS = [
  {
    label: "Query",
    value: "query",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const req = rawData.request_payload as HttpRequestDetail;
      const value = req.req_body;
      let display = "";
      if (value.length) {
        display = stringWithoutComments(value.trim());
      }
      return <CodeBlock code={display} allowCopy color="light" />;
    },
  },
  {
    label: "Result",
    value: "result",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      return (
        <SQLRawTable
          value={
            (rawData.response_payload as unknown as HttpResponseDetail)
              .resp_body as string
          }
        />
      );
    },
  },
];

export const getTabs = (
  protocol: string
): Array<{
  label: string;
  value: string;
  render?: (metadata: SpanDetail, rawData: SpanRawData) => React.ReactNode;
}> => {
  switch (protocol) {
    case "http":
      return [...DEFAULT_TABS, ...HTTP_TABS];
    case "mysql":
      return [...DEFAULT_TABS, ...MYSQL_TABS];
    default:
      return DEFAULT_TABS;
  }
};
