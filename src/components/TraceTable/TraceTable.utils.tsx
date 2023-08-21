import { createColumnHelper } from "@tanstack/react-table";
import SpanEntryPoint from "components/helpers/SpanEntryPoint";
import { DEFAULT_COL_WIDTH, type HTTP_METHODS } from "utils/constants";
import { getFormattedTime } from "utils/dateHelpers";
import { convertNanoToMilliSeconds, trimString } from "utils/functions";
import { type TraceMetadataDetail } from "utils/issues/types";

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
    size: DEFAULT_COL_WIDTH,
    cell: (info) => {
      return (
        <div className={styles["entry-point-container"]}>
          <SpanEntryPoint action={info.row.original.action} />
          <span className={styles["entry-point"]}>
            {trimString(info.getValue(), 40)}{" "}
          </span>
          {/* <ChipX label={info.row.original.protocol} /> */}
        </div>
      );
    },
  }),
  helper.accessor("latency_ns", {
    header: "DURATION",
    size: DEFAULT_COL_WIDTH / 2,
    cell: (info) => {
      return <span>{convertNanoToMilliSeconds(info.getValue())}</span>;
    },
  }),
  helper.accessor("incident_collection_time", {
    header: "TIMESTAMP",
    size: DEFAULT_COL_WIDTH * 1.5,
    cell: (info) => {
      return <span>{getFormattedTime(info.getValue())}</span>;
    },
  }),
];
