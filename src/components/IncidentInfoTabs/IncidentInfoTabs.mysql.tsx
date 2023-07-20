import CodeBlock from "components/CodeBlock";
import SQLRawTable from "components/SQLRawTable";
import ChipX from "components/themeX/ChipX";
import { stringWithoutComments } from "utils/functions";

import styles from "./IncidentInfoTabs.module.scss";

export const MYSQL_TAB_KEYS = ["overview", "query", "result"] as const;

interface MySqlTabKey {
  label: string;
  key: string;
  render?: (val: any) => React.ReactNode;
}

export const MYSQL_TABS: Array<{
  label: string;
  key: (typeof MYSQL_TAB_KEYS)[number];
}> = [
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

export const MYSQL_OVERVIEW_KEYS: MySqlTabKey[] = [
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
    render: (value) => `${value as string} ms`,
  },
  { label: "Status", key: "status" },
];

export const MYSQL_QUERY_KEYS = [
  {
    label: "Query",
    key: "request_payload.req_body",
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
