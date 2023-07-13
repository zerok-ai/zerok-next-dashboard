import PrivateRoute from "components/PrivateRoute";
import styles from "./IssuesPage.module.scss";
import PageLayout from "components/layouts/PageLayout";
import { Fragment, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useFetch } from "hooks/useFetch";
import {
  LIST_INCIDENTS_ENDPOINT,
  LIST_SERVICES_ENDPOINT_V2,
} from "utils/endpoints";
import { IssueDetail, ServiceDetail } from "utils/types";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AiOutlineArrowRight } from "react-icons/ai";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import TableX from "components/themeX/TableX";
import { DEFAULT_COL_WIDTH, IGNORED_SERVICES_PREFIXES } from "utils/constants";
import ChipX from "components/themeX/ChipX";
import Link from "next/link";
import { getNamespace, trimString } from "utils/functions";
import { nanoid } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import TagX from "components/themeX/TagX";
import { useSelector } from "redux/store";
import { HiPlus } from "react-icons/hi";
import { clusterSelector } from "redux/cluster";
import ServicesMenu from "./IssuesPage.utils";
import { Button, Skeleton } from "@mui/material";
import CreateNewIssueDrawer from "components/CreateNewIssueDrawer";

const filterAndSortServices = (newData: ServiceDetail[]) => {
  return newData.filter(
    (sv) => !IGNORED_SERVICES_PREFIXES.includes(getNamespace(sv.service))
  );
};

const IssuesPage = () => {
  const [page, setPage] = useState(1);
  const { selectedCluster } = useSelector(clusterSelector);
  const {
    loading,
    error,
    data: incidents,
    fetchData: fetchIncidents,
  } = useFetch<IssueDetail[]>("issues");

  const {
    loading: serviceListLoading,
    error: serviceListError,
    data: serviceList,
    fetchData: fetchServices,
  } = useFetch<ServiceDetail[]>("results", null, filterAndSortServices);

  const router = useRouter();

  const { query } = router;
  // @TODO - add types for filters here

  const services = query.services
    ? decodeURIComponent(query.services as string).split(",")
    : null;

  const helper = createColumnHelper<IssueDetail>();

  const columns = useMemo(() => {
    return [
      helper.accessor("issue_title", {
        header: "Incident",
        size: DEFAULT_COL_WIDTH * 6,
        cell: (info) => {
          const { issue_title, issue_hash, source, destination, incidents } =
            info.row.original;
          return (
            <div className={styles["issue-container"]}>
              <div className={styles["issue-title-container"]}>
                <Link
                  href={`/issues/${issue_hash}/${incidents[0]}`}
                  className={"hover-link"}
                >
                  <a className={styles["issue-title"]}>
                    {trimString(issue_title, 100)}
                  </a>
                </Link>
              </div>
              <div className={styles["issue-path"]}>
                <ChipX label={source} />{" "}
                <AiOutlineArrowRight
                  className={styles["issue-path-arrow-icon"]}
                />{" "}
                <ChipX label={destination} />
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
              {getFormattedTime(last_seen)}
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
              {getRelativeTime(first_seen)}
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
  }, [incidents]);

  const table = useReactTable<IssueDetail>({
    columns,
    data: incidents || [],
    getCoreRowModel: getCoreRowModel(),
  });

  const removeService = (label: string) => {
    if (services) {
      const filtered = services.filter((sv) => sv !== label);
      const newQuery = { ...query };
      if (filtered.length) {
        newQuery.services = filtered.join(",");
      } else delete newQuery.services;
      router.push({
        pathname: "/issues",
        query: {
          ...newQuery,
        },
      });
    }
  };
  useEffect(() => {
    if (selectedCluster) {
      fetchIncidents(
        LIST_INCIDENTS_ENDPOINT.replace("{id}", selectedCluster as string)
      );
      fetchServices(LIST_SERVICES_ENDPOINT_V2.replace("{id}", selectedCluster));
    }
  }, [selectedCluster]);

  return (
    <div>
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Issues</title>
        </Head>
      </Fragment>
      <div className="page-title">
        <div className={styles["header"]}>
          <div className={styles["header-left"]}>
            <h3>Issues</h3>
            <div className={styles["services-select-container"]}>
              <ServicesMenu serviceList={serviceList} />
            </div>
            <div className={styles["active-filters"]}>
              {!!services?.length &&
                services.map((sv) => {
                  return (
                    <TagX
                      label={sv}
                      onClose={removeService}
                      closable={true}
                      key={nanoid()}
                    />
                  );
                })}
            </div>
          </div>
          <div className={styles["header-right"]}>
            <CreateNewIssueDrawer services={serviceList} />
          </div>
        </div>
      </div>
      <div className="page-content">
        {selectedCluster && !loading && incidents ? (
          <TableX table={table} data={incidents} />
        ) : (
          <div className={styles["skeleton-container"]}>
            <Skeleton
              variant="rectangular"
              className={styles["skeleton-header"]}
              key={nanoid()}
            />
            <Skeleton
              variant="rectangular"
              className={styles["skeleton-row"]}
              key={nanoid()}
            />
            <Skeleton
              variant="rectangular"
              className={styles["skeleton-row"]}
              key={nanoid()}
            />
            <Skeleton
              variant="rectangular"
              className={styles["skeleton-row"]}
              key={nanoid()}
            />
          </div>
        )}
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
