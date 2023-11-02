import cx from "classnames";
import CodeBlock from "components/helpers/CodeBlock";
import SQLRawTable from "components/helpers/SQLRawTable";
import ChipX from "components/themeX/ChipX";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import { getFormattedTime } from "utils/dateHelpers";
import {
  convertNanoToMilliSeconds,
  stringWithoutComments,
} from "utils/functions";
import {
  type GenericObject,
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
  optional?: boolean;
}

export const renderListOfKeyValue = (list: TabKeyType[]) => {
  return (
    <div className={styles["key-value-container"]}>
      {list.map((key) => {
        const renderKey = key.customRender ? key.customRender() : key.value;
        if (key.optional && !key.value) {
          return null;
        }
        return (
          <div
            className={cx(
              styles["key-value-row"],
              key.fullWidth && styles["full-width"]
            )}
            key={nanoid()}
          >
            {!key.fullWidth && (
              <div className={styles["key-value-key"]}>{key.label}:</div>
            )}
            <div className={styles["key-value-value"]}>{renderKey}</div>
          </div>
        );
      })}
    </div>
  );
};

export const renderJSON = (val: GenericObject | string) => {
  try {
    return <DynamicReactJson src={val as GenericObject} />;
  } catch (err) {
    return <CodeBlock code={val as string} allowCopy color="light" />;
  }
};

const renderJSONorString = (val: GenericObject | string | boolean) => {
  const type = typeof val;
  if (type === "string" && !(val as string).length) {
    return <p>No data found.</p>;
  }
  if (type === "boolean") {
    return (
      <CodeBlock
        code={(val as string | boolean).toString()}
        allowCopy={false}
        color="light"
      />
    );
  }
  try {
    const json = JSON.parse(val as string);
    if (typeof json !== "object") {
      throw new Error("Not an object");
    }
    return (
      <DynamicReactJson
        src={json as GenericObject}
        displayDataTypes={false}
        name={false}
        enableClipboard={false}
        theme="twilight"
      />
    );
  } catch (err) {
    return <CodeBlock code={val as string} allowCopy={false} color="light" />;
  }
};

export const DEFAULT_TABS = [
  {
    label: "Overview",
    value: "overview",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const KEYS = [
        {
          label: "Protocol",
          value: metadata.protocol,
          customRender: () => {
            return <ChipX label={metadata.protocol} upperCase={true} />;
          },
        },
        {
          label: "Source",
          value: metadata.source,
          optional: true,
        },
        {
          label: "Destination",
          value: metadata.destination,
          optional: true,
        },
        {
          label: "Latency",
          value: `${convertNanoToMilliSeconds(metadata.latency)}`,
        },
        {
          label: "Span kind",
          value: metadata.kind,
        },
        {
          label: "Route",
          value: metadata.route,
          optional: true,
        },
        {
          label: "Span ID",
          value: metadata.span_id,
        },
        {
          label: "Timestamp",
          value: getFormattedTime(metadata.start_time),
        },
        {
          label: "Status",
          value: metadata.status,
          optional: true,
        },
      ];
      return renderListOfKeyValue(KEYS);
    },
  },
];

export const SPAN_ATTRIBUTE_TABS = [
  {
    label: "Span Attributes",
    value: "span_attributes",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const keys = Object.keys(metadata.all_attributes!);
      return (
        <Fragment>
          {keys.map((key) => {
            return (
              <div className={cx(styles["span-attr-row"])} key={nanoid()}>
                {<div className={styles["span-attr-key"]}>{key}:</div>}
                <div className={styles["span-attr-value"]}>
                  {metadata.all_attributes![key]}
                </div>
              </div>
            );
          })}
        </Fragment>
      );
    },
  },
];

export const HTTP_TABS = [
  {
    label: "Request headers",
    value: "request_header",

    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const KEYS = [
        {
          label: "Request headers",
          fullWidth: true,
          value: rawData.req_headers as string,
          customRender: () => {
            return renderJSONorString(rawData.req_headers);
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
      const KEYS = [
        {
          label: "Request body",
          value: rawData.req_body as string,
          fullWidth: true,
          customRender: () => {
            return renderJSONorString(rawData.req_body);
          },
        },
      ];
      return renderListOfKeyValue(KEYS);
    },
  },
  {
    label: "Response headers",
    value: "response_headers",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const KEYS = [
        {
          label: "Response headers",
          value: rawData.resp_headers as string,
          fullWidth: true,
          customRender: () => {
            return renderJSONorString(rawData.resp_headers);
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
      const KEYS = [
        {
          label: "Response body",
          fullWidth: true,
          value: rawData.resp_body as string,
          customRender: () => {
            return renderJSONorString(rawData.resp_body);
          },
        },
      ];
      return renderListOfKeyValue(KEYS);
    },
  },
];

export const GRPC_TABS = [
  {
    label: "Metadata",
    value: "request_header",

    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const KEYS = [
        {
          label: "Request headers",
          fullWidth: true,
          value: rawData.req_headers as string,
          customRender: () => {
            return renderJSONorString(rawData.req_headers);
          },
        },
      ];
      return renderListOfKeyValue(KEYS);
    },
  },
  {
    label: "Message",
    value: "request_body",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const KEYS = [
        {
          label: "Request body",
          value: rawData.req_body as string,
          fullWidth: true,
          customRender: () => {
            return renderJSONorString(rawData.req_body);
          },
        },
      ];
      return renderListOfKeyValue(KEYS);
    },
  },
  {
    label: "Response headers",
    value: "response_headers",
    render: (metadata: SpanDetail, rawData: SpanRawData) => {
      const KEYS = [
        {
          label: "Response headers",
          value: rawData.resp_headers as string,
          fullWidth: true,
          customRender: () => {
            return renderJSONorString(rawData.resp_headers);
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
      const KEYS = [
        {
          label: "Response body",
          fullWidth: true,
          value: rawData.resp_body as string,
          customRender: () => {
            return renderJSONorString(rawData.resp_body);
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
      const value = rawData.req_body;
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
      return <SQLRawTable value={rawData.resp_body as string} />;
    },
  },
];

export const getTabs = (
  span: SpanDetail
): Array<{
  label: string;
  value: string;
  render?: (metadata: SpanDetail, rawData: SpanRawData) => JSX.Element;
}> => {
  const { protocol } = span;
  const tabs = [...DEFAULT_TABS];

  if (span.has_raw_data !== false) {
    switch (protocol) {
      case "http":
      case "HTTP":
        tabs.push(...HTTP_TABS);
        break;
      case "mysql":
      case "MYSQL":
        tabs.push(...MYSQL_TABS);
        break;
      case "grpc":
      case "GRPC":
        tabs.push(...GRPC_TABS);
        break;
      default:
        return tabs;
    }
  }
  if (span.all_attributes) {
    tabs.push(...SPAN_ATTRIBUTE_TABS);
  }
  return tabs;
};
