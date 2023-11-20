import { createColumnHelper } from "@tanstack/react-table";
import TableTimeCell from "components/TableTimeCell";
import TooltipX from "components/themeX/TooltipX";
import ZkLink from "components/themeX/ZkLink";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { trimString } from "utils/functions";
import { getTitleFromIssue } from "utils/issues/functions";
import { type TableSortOptions } from "utils/tables/types";
import { type IssueDetail } from "utils/types";

import styles from "./IssuesListPage.module.scss";

const helper = createColumnHelper<IssueDetail>();

export const getIssueColumns = (zkChatEnabled: boolean) => {
  return [
    helper.accessor("issue_title", {
      header: "Issue",
      size: DEFAULT_COL_WIDTH * 4,
      cell: (info) => {
        const { issue_title, issue_hash, scenario_id, incidents } =
          info.row.original;
        const incidentString = zkChatEnabled ? "latest" : "trace";
        const title = getTitleFromIssue(issue_title);
        const route = `/issues/detail?issue_id=${issue_hash}&${incidentString}=${incidents[0]}&scenario=${scenario_id}`;
        return (
          <TooltipX title={title} disabled={title.length < 100}>
            <ZkLink href={route}>{trimString(title, 100)}</ZkLink>
          </TooltipX>
        );
      },
    }),
    helper.display({
      header: "Reporting source",
      size: DEFAULT_COL_WIDTH * 0.8,
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
      size: DEFAULT_COL_WIDTH * 1,
      cell: (info) => <TableTimeCell time={info.getValue()} />,
    }),
    helper.accessor("first_seen", {
      header: "First collected",
      size: DEFAULT_COL_WIDTH * 1,
      cell: (info) => <TableTimeCell time={info.getValue()} />,
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
