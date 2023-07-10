import PrivateRoute from "components/PrivateRoute";
import styles from "./IssuesPage.module.scss";
import PageLayout from "components/layouts/PageLayout";
import { Fragment, useMemo, useState } from "react";
import Head from "next/head";
import { useFetch } from "hooks/useFetch";
import { LIST_INCIDENTS_ENDPOINT } from "utils/endpoints";
import { IncidentDetail } from "utils/types";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { BsCodeSlash } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";
import { getRelativeTime } from "utils/dateHelpers";
import TableX from "components/themeX/TableX";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import ChipX from "components/themeX/ChipX";
import Link from "next/link";
import { trimString } from "utils/functions";
import { nanoid } from "@reduxjs/toolkit";

const IssuesPage = () => {
  const [page, setPage] = useState(1);
  const {
    loading,
    error,
    data: incidents,
  } = useFetch<IncidentDetail[]>("issues", LIST_INCIDENTS_ENDPOINT);

  const helper = createColumnHelper<IncidentDetail>();

  const columns = useMemo(() => {
    return [
      helper.accessor("issue_title", {
        header: "Incident",
        size: DEFAULT_COL_WIDTH * 6,
        cell: (info) => {
          const { issue_title, first_seen, last_seen, issue_id } =
            info.row.original;
          return (
            <div className={styles["issue-container"]}>
              <div className={styles["issue-title-container"]}>
                <Link href={`/issues/${issue_id}`} className={"hover-link"}>
                  <p className={styles["issue-title"]}>
                    {trimString(issue_title, 100)}
                  </p>
                </Link>
              </div>
              <p className={styles["issue-description"]}>
                <em>Error description</em>
              </p>
              <div className={styles["issue-info-container"]}>
                <span className={styles["issue-language-container"]}>
                  <BsCodeSlash /> Java
                </span>
                <span className={styles["issue-time-container"]}>
                  <AiOutlineClockCircle />{" "}
                  <span>{getRelativeTime(first_seen)}</span>
                </span>{" "}
                |
                <span className={styles["issue-time-container"]}>
                  <AiOutlineClockCircle />{" "}
                  <span>{getRelativeTime(last_seen)}</span>
                </span>
                <span className={styles["issue-id-container"]}>
                  <span>#{issue_id}</span>
                </span>
              </div>
            </div>
          );
        },
      }),
      helper.accessor("source", {
        header: "Path",
        size: DEFAULT_COL_WIDTH,
        cell: (info) => {
          const { source, destination } = info.row.original;
          return (
            <div className={styles["issue-path-container"]}>
              <ChipX label={source} />
              <span> ———&gt; </span>
              <ChipX label={destination} />
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
        size: DEFAULT_COL_WIDTH / 2,
      }),
      // Source / destination
      helper.accessor("source", {
        header: "Source",
        size: DEFAULT_COL_WIDTH / 2,
        id: nanoid(),
      }),
      helper.accessor("destination", {
        header: "Destination",
        size: DEFAULT_COL_WIDTH / 2,
      }),
    ];
  }, [incidents]);

  const table = useReactTable<IncidentDetail>({
    columns,
    data: incidents || [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Issues</title>
        </Head>
      </Fragment>
      <h3 className="page-title">Issues</h3>
      <div className="page-content">
        <TableX table={table} data={incidents || []} />
      </div>
    </div>
  );
};

IssuesPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default IssuesPage;
