import { createColumnHelper } from "@tanstack/react-table";
import cx from "classnames";
// import ChipX from "components/themeX/ChipX";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { formatDuration, getFormattedTime } from "utils/dateHelpers";
import { convertNanoToMilliSeconds, trimString } from "utils/functions";
import { type TraceMetadataDetail } from "utils/issues/types";
import { type TableSortOptions } from "utils/tables/types";

import styles from "./TraceTable.module.scss";

const helper = createColumnHelper<TraceMetadataDetail>();

export const getTraceColumns = ({
  chatTrace,
  currentTrace,
}: {
  chatTrace: string | null;
  currentTrace: string;
}) => {
  return [
    helper.accessor("entry_path", {
      header: "REQUEST ENTRY POINT",
      size: DEFAULT_COL_WIDTH * 1.5,
      enableSorting: false,
      cell: (info) => {
        const spanService = info.row.original.entry_service ?? "Unknown";
        const spanPath = info.row.original.entry_path ?? "";
        const spanName = `${spanService} ${spanPath ? `| ${spanPath}` : ""}`;
        return (
          <div className={styles["entry-point-container"]}>
            <span
              className={cx(
                styles["entry-point"],
                currentTrace === info.row.original.incident_id && styles.active
              )}
            >
              {trimString(spanName, 30)}{" "}
            </span>
            {/* {chatTrace === info.row.original.incident_id && (
              <ChipX label="Inferred" color="primary" upperCase={false} />
            )} */}
          </div>
        );
      },
    }),
    helper.accessor("latency_ns", {
      header: "DURATION",
      size: DEFAULT_COL_WIDTH / 2,
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
    helper.accessor("incident_root_span_time", {
      header: "TIMESTAMP",
      enableSorting: true,
      size: DEFAULT_COL_WIDTH,
      cell: (info) => {
        return <span>{getFormattedTime(info.getValue())}</span>;
      },
    }),
  ];
};

export const INCIDENT_COL_FILTERS: TableSortOptions[] = [
  {
    label: "Latest first",
    value: "incident_root_span_time:desc",
    sort: "desc",
  },
  {
    label: "Earliest first",
    value: "incident_root_span_time:asc",
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
