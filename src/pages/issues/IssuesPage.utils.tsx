import { Tooltip } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { trimString } from "utils/functions";
import { getTitleFromIssue } from "utils/issues/functions";
import { type TableSortOptions } from "utils/tables/types";
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

        const title = trimString(getTitleFromIssue(issue_title), 100);
        return (
          <div className={styles["issue-container"]}>
            <div>
              <Link
                href={`/issues/detail?issue_id=${issue_hash}&issue=${scenario_id}`}
                className={"hover-link"}
              >
                <span className={styles["issue-title-container"]}>{title}</span>
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
            <img src={`/images/brand/zerok_source_logo.png`} alt="zerok_logo" />
            <span>ZeroK</span>
          </div>
        );
      },
    }),
    helper.accessor("last_seen", {
      header: "Last collected",
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
      header: "First collected",
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
  ];
};

export const ISSUE_SORT_OPTIONS: TableSortOptions[] = [
  {
    label: "Latest first",
    value: "last_seen:desc",
    sort: "desc",
  },
  {
    label: "Earliest first",
    value: "last_seen:asc",
    sort: "asc",
  },
];

const Dummy = () => <span>hey</span>;
export default Dummy;
