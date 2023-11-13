import { Tooltip } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import TooltipX from "components/themeX/TooltipX";
import ZkLink from "components/ZkLink";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { trimString } from "utils/functions";
import { getTitleFromIssue } from "utils/issues/functions";
import { type TableSortOptions } from "utils/tables/types";
import { type IssueDetail } from "utils/types";

import styles from "./IssuesListPage.module.scss";

const helper = createColumnHelper<IssueDetail>();

export const getIssueColumns = () => {
  return [
    helper.accessor("issue_title", {
      header: "Issue",
      size: DEFAULT_COL_WIDTH * 8,
      cell: (info) => {
        const { issue_title, issue_hash, scenario_id, incidents } =
          info.row.original;
        const title = getTitleFromIssue(issue_title);
        const route = `/issues/detail?issue_id=${issue_hash}&latest=${incidents[0]}&scenario=${scenario_id}`;
        return (
          <TooltipX title={title} disabled={title.length < 100}>
            <ZkLink href={route}>{trimString(title, 100)}</ZkLink>
          </TooltipX>
        );
      },
    }),
    helper.display({
      header: "Reporting source",
      cell: () => {
        return (
          <figure className={styles.source}>
            <img src={`/images/brand/zerok_source_logo.png`} alt="zerok_logo" />
            <span>ZeroK</span>
          </figure>
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
