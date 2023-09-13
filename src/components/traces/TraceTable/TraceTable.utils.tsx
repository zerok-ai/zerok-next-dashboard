import { createColumnHelper } from "@tanstack/react-table";
import SpanEntryPoint from "components/helpers/SpanEntryPoint";
import { DEFAULT_COL_WIDTH, type HTTP_METHODS } from "utils/constants";
import { formatDuration, getFormattedTime } from "utils/dateHelpers";
import { convertNanoToMilliSeconds, trimString } from "utils/functions";
import { type TraceMetadataDetail } from "utils/issues/types";
import { type TableSortOptions } from "utils/tables/types";

import styles from "./TraceTable.module.scss";

export const HttpActionRender = ({
  action,
}: {
  action: (typeof HTTP_METHODS)[number];
}) => {
  switch (action) {
    case "DELETE":
      return <span className={styles["action-delete"]}>DELETE</span>;
    default:
      return <span className={styles["action-default"]}>{action}</span>;
  }
};

const helper = createColumnHelper<TraceMetadataDetail>();
export const INCIDENT_COLUMNS = [
  helper.accessor("entry_path", {
    header: "REQUEST ENTRY POINT",
    size: DEFAULT_COL_WIDTH * 2,
    enableSorting: false,
    cell: (info) => {
      return (
        <div className={styles["entry-point-container"]}>
          <SpanEntryPoint action={info.row.original.action} />
          <span className={styles["entry-point"]}>
            {trimString(info.getValue(), 45)}{" "}
          </span>
          {/* <ChipX label={info.row.original.protocol} /> */}
        </div>
      );
    },
  }),
  helper.accessor("latency_ns", {
    header: "DURATION",
    size: DEFAULT_COL_WIDTH / 1.5,
    enableSorting: true,
    cell: (info) => {
      return (
        <span>
          {formatDuration(
            convertNanoToMilliSeconds(info.getValue(), false) as number
          )}
        </span>
      );
    },
  }),
  helper.accessor("incident_collection_time", {
    header: "TIMESTAMP",
    enableSorting: true,
    // sortingFn: (a: string, b: string) => {
    //   return dayjs(a).unix() - dayjs(b).unix();
    // },
    size: DEFAULT_COL_WIDTH * 1.2,
    cell: (info) => {
      return <span>{getFormattedTime(info.getValue())}</span>;
    },
  }),
];

export const INCIDENT_COL_FILTERS: TableSortOptions[] = [
  {
    label: "Latest first",
    value: "incident_collection_time:desc",
    sort: "desc",
  },
  {
    label: "Earliest first",
    value: "incident_collection_time:asc",
    sort: "asc",
  },
  {
    label: "Latency high to low ",
    value: "latency_ns:desc",
    sort: "desc",
  },
  {
    label: "Latency low to high",
    value: "latency_ns:asc",
    sort: "asc",
  },
];
