import { Tooltip } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { trimString } from "utils/functions";
import { type IssueDetail } from "utils/types";

import styles from "./IssuesPage.module.scss";

const helper = createColumnHelper<IssueDetail>();

export const getIssueColumns = () => {
  return [
    helper.accessor("issue_title", {
      header: "Issue",
      size: DEFAULT_COL_WIDTH * 8,
      cell: (info) => {
        const { issue_title, issue_hash, scenario_id } = info.row.original;

        const split = issue_title.split("¦");
        const title = split[0];
        const service = split[1];
        const group3 = split.length > 2 ? split[2] : null;
        return (
          <div className={styles["issue-container"]}>
            <div>
              <Link
                href={`/issues/detail?issue_id=${issue_hash}&issue=${scenario_id}`}
                className={"hover-link"}
              >
                <span className={styles["issue-title-container"]}>
                  {title}{" "}
                  {service && (
                    <span className={styles["issue-title-joiner"]}>in</span>
                  )}
                  {service}
                  {group3 && group3.length > 0 && `: ${trimString(group3, 60)}`}
                  {/* <TagX label={scenario_type} closable={false} /> */}
                </span>
              </Link>
            </div>
          </div>
        );
      },
    }),
    helper.display({
      header: "Reporting source",
      cell: () => {
        return (
          <div className={styles.source}>
            <img src={`/images/brand/zerok_source_logo.svg`} alt="zerok_logo" />
            <span>ZeroK</span>
          </div>
        );
      },
    }),
    helper.accessor("last_seen", {
      header: "Last seen",
      size: DEFAULT_COL_WIDTH * 2.4,
      cell: (info) => {
        const { last_seen } = info.row.original;
        return (
          <div className={styles["issue-time-container"]}>
            <Tooltip title={getFormattedTime(last_seen)} placement="top" arrow>
              <span>{last_seen ? getRelativeTime(last_seen) : "Never"}</span>
            </Tooltip>
          </div>
        );
      },
    }),
    helper.accessor("first_seen", {
      header: "First seen",
      size: DEFAULT_COL_WIDTH * 1.5,
      cell: (info) => {
        const { first_seen } = info.row.original;
        return (
          <div className={styles["issue-time-container"]}>
            <Tooltip title={getFormattedTime(first_seen)} placement="top" arrow>
              <span>{first_seen ? getRelativeTime(first_seen) : "Never"}</span>
            </Tooltip>
          </div>
        );
      },
    }),

    // Velocity
    // helper.accessor("velocity", {
    //   header: "Velocity",
    //   size: DEFAULT_COL_WIDTH / 2,
    //   cell: (info) => {
    //     const { velocity } = info.row.original;
    //     return (
    //       <div className={styles["issue-time-container"]}>
    //         <span>{velocity ?? "0"}</span>
    //       </div>
    //     );
    //   },
    // }),
    // Total events
    // helper.accessor("total_count", {
    //   header: "Total events",
    //   size: DEFAULT_COL_WIDTH * 1.2,
    //   cell: (info) => {
    //     const { total_count } = info.row.original;
    //     return (
    //       <div className={styles["issue-time-container"]}>
    //         <span>{total_count ?? "0"}</span>
    //       </div>
    //     );
    //   },
    // }),
  ];
};

const Dummy = () => <span>hey</span>;
export default Dummy;
