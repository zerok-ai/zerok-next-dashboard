import { Tooltip } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import ChipX from "components/themeX/ChipX";
import TagX from "components/themeX/TagX";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import { type ScenarioDetail } from "utils/scenarios/types";

import styles from "./IssuesPage.module.scss";

const helper = createColumnHelper<ScenarioDetail>();

const filterEmptyStrings = (list: string[] | undefined) => {
  if (!list) return null;
  return list.filter((item) => item.length > 0);
};

export const getIssueColumns = () => {
  return [
    helper.accessor("scenario_title", {
      header: "Issues",
      size: DEFAULT_COL_WIDTH * 3,
      cell: (info) => {
        const {
          scenario_title,
          scenario_type,
          sources,
          destinations,
          scenario_id,
        } = info.row.original;
        const filteredSource = filterEmptyStrings(sources);
        const filteredDestination = filterEmptyStrings(destinations);
        const source = (sources && filteredSource && filteredSource[0]) ?? null;
        const destination =
          (destinations && filteredDestination && filteredDestination[0]) ??
          null;
        return (
          <div className={styles["issue-container"]}>
            <div>
              <Link
                href={`/issues/detail?issue=${scenario_id}`}
                className={"hover-link"}
              >
                <span className={styles["issue-title-container"]}>
                  <a className={styles["issue-title"]}>{scenario_title}</a>
                  <TagX label={scenario_type} closable={false} />
                </span>
              </Link>
            </div>
            {source && destination && (
              <div className={styles["issue-path"]}>
                <ChipX label={source} />{" "}
                <HiArrowRight className={styles["issue-path-arrow-icon"]} />
                <ChipX label={destination} />
              </div>
            )}
          </div>
        );
      },
    }),
    helper.accessor("last_seen", {
      header: "Last seen",
      size: DEFAULT_COL_WIDTH * 2.4,
      cell: (info) => {
        const { last_seen } = info.row.original;
        console.log({ last_seen });
        return (
          <div className={styles["issue-time-container"]}>
            <Tooltip title={getFormattedTime(last_seen)} placement="top" arrow>
              <span>{last_seen ? getRelativeTime(last_seen) : ""}</span>
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
              <span>{first_seen ? getRelativeTime(first_seen) : ""}</span>
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
