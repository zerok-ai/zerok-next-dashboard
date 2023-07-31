import { createColumnHelper } from "@tanstack/react-table";
import SpanEntryPoint from "components/helpers/SpanEntryPoint";
import { type HTTP_METHODS } from "utils/constants";
import { getFormattedTime } from "utils/dateHelpers";
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
  helper.accessor("entry_point", {
    header: "REQUEST ENTRY POINT",
    cell: (info) => {
      return (
        <div className={styles["entry-point-container"]}>
          <SpanEntryPoint action={info.row.original.action} />
          <span className={styles["entry-point"]}>
            {info.row.original.entry_point}{" "}
          </span>
        </div>
      );
    },
  }),
  helper.accessor("latency", {
    header: "DURATION",
  }),
  helper.accessor("timestamp", {
    header: "TIMESTAMP",
    cell: (info) => {
      return <span>{getFormattedTime(info.getValue())}</span>;
    },
  }),
];
