import ChipX from "components/themeX/ChipX";
import CodeBlock from "components/CodeBlock";
import { stringWithoutComments } from "utils/functions";
import SQLRawTable from "components/SQLRawTable";

import styles from "./IncidentInfoTabs.module.scss";

export const MYSQL_TAB_KEYS = ["overview", "query", "result"] as const;

export const MYSQL_TABS: {
  label: string;
  key: (typeof MYSQL_TAB_KEYS)[number];
}[] = [
  {
    label: "Overview",
    key: "overview",
  },
  {
    label: "Query",
    key: "query",
  },
  {
    label: "Result",
    key: "result",
  },
];

export const MYSQL_OVERVIEW_KEYS: {
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

export const MYSQL_QUERY_KEYS = [
  {
    label: "Query",
    key: "req_body",
    render: (value: string) => (
      <CodeBlock
        code={stringWithoutComments(value.trim())}
        allowCopy
        color="light"
      />
    ),
  },
];

export const MYSQL_RESULT_KEYS = [
  {
    label: "Result",
    key: "resp_body",
    render: (value: string) => {
      return (
        <div className={styles["sql-table-container"]}>
          <SQLRawTable value={value} />
        </div>
      );
    },
  },
];
