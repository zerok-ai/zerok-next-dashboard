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
    return `{ }`;
  }
  if (type === "boolean") {
    return (
      <CodeBlock
        code={(val as string | boolean).toString()}
        allowCopy
        color="light"
      />
    );
  }
  try {
    const json = JSON.parse(val as string);
    return (
      <DynamicReactJson src={json as GenericObject} displayDataTypes={false} />
    );
  } catch (err) {
    return <CodeBlock code={val as string} allowCopy color="light" />;
  }
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
          value: `${convertNanoToMilliSeconds(metadata.latency)}`,
        },
        {
          label: "Timestamp",
          value: getFormattedTime(metadata.start_time),
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
      const KEYS = [
        {
          label: "Request headers",
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
          customRender: () => {
            return renderJSONorString(rawData.req_body);
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
      const KEYS = [
        {
          label: "Response headers",
          value: rawData.resp_headers as string,
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
