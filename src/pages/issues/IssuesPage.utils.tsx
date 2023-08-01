import { Tooltip } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import ChipX from "components/themeX/ChipX";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { type IssueDetail } from "utils/types";

import styles from "./IssuesPage.module.scss";

const helper = createColumnHelper<IssueDetail>();

export const getIssueColumns = () => {
  return [
    helper.accessor("issue_title", {
      header: "Incident",
      size: DEFAULT_COL_WIDTH * 6,
      cell: (info) => {
        const { issue_title, issue_hash, sources, destinations, incidents } =
          info.row.original;
        const filteredSources = sources.filter((source) => source.length > 0);
        const filteredDestinations = destinations.filter(
          (dest) => dest.length > 0
        );
        return (
          <div className={styles["issue-container"]}>
            <div className={styles["issue-title-container"]}>
              <Link
                href={`/issues/detail?issue=${issue_hash}&incident=${incidents[0]}`}
                className={"hover-link"}
              >
                <a className={styles["issue-title"]}>{issue_title}</a>
              </Link>
            </div>
            <div className={styles["issue-path"]}>
              <ChipX label={filteredSources[0]} />{" "}
              <AiOutlineArrowRight
                className={styles["issue-path-arrow-icon"]}
              />{" "}
              <ChipX label={filteredDestinations[0]} />
            </div>
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
              <span>{getRelativeTime(last_seen)}</span>
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
              <span>{getRelativeTime(first_seen)}</span>
            </Tooltip>
          </div>
        );
      },
    }),
    // Velocity
    helper.accessor("velocity", {
      header: "Velocity",
      size: DEFAULT_COL_WIDTH / 2,
    }),
    // Total events
    helper.accessor("total_count", {
      header: "Total events",
      size: DEFAULT_COL_WIDTH * 1.2,
    }),
  ];
};

const Dummy = () => <span>hey</span>;
export default Dummy;
