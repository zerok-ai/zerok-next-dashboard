import { nanoid } from "@reduxjs/toolkit";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import CustomSkeleton from "components/CustomSkeleton";
import PageLayout from "components/layouts/PageLayout";
import PaginationX from "components/PaginationX";
import PrivateRoute from "components/PrivateRoute";
import ServicesMenu from "components/ServicesFilter/ServicesFilter";
import TableX from "components/themeX/TableX";
import TagX from "components/themeX/TagX";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import queryString from "query-string";
import { Fragment, useEffect, useMemo } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { LIST_ISSUES_ENDPOINT, LIST_SERVICES_ENDPOINT } from "utils/endpoints";
import { filterServices } from "utils/functions";
import { ISSUES_PAGE_SIZE } from "utils/issues/constants";
import { type IssueDetail, type ServiceDetail } from "utils/types";

import styles from "./IssuesPage.module.scss";
import { getIssueColumns } from "./IssuesPage.utils";

interface IssuesData {
  issues: IssueDetail[];
  total_records: number;
}

const IssuesPage = () => {
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);
  const {
    loading,
    data: issuesData,
    fetchData: fetchIssues,
  } = useFetch<IssuesData>("");

  const { data: serviceList, fetchData: fetchServices } = useFetch<
    ServiceDetail[]
  >("results", null, filterServices);

  const router = useRouter();

  const { query } = router;
  const page = query.page ? parseInt(query.page as string) : 1;
  // @TODO - add types for filters here

  const services =
    query.services && query.services?.length > 0
      ? decodeURIComponent(query.services as string).split(",")
      : null;

  const columns = useMemo(() => {
    return getIssueColumns();
  }, [issuesData?.issues]);

  const table = useReactTable<IssueDetail>({
    columns,
    data: issuesData?.issues ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  const removeService = (label: string) => {
    if (services != null) {
      const filtered = services.filter((sv) => sv !== label);
      const newQuery = { ...query };
      if (filtered.length > 0) {
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
      const filter = services && services.length > 0 ? services.join(",") : "";
      const range = query.range ?? DEFAULT_TIME_RANGE;
      const params = queryString.stringify({
        services: filter,
        limit: ISSUES_PAGE_SIZE,
        offset: (page - 1) * ISSUES_PAGE_SIZE,
        st: range,
      });
      const endpoint =
        LIST_ISSUES_ENDPOINT.replace("{id}", selectedCluster) + params;
      fetchIssues(endpoint);
      fetchServices(
        LIST_SERVICES_ENDPOINT.replace("{id}", selectedCluster) +
          `st=${range as string}`
      );
    }
  }, [selectedCluster, router, renderTrigger]);

  return (
    <div>
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Issues</title>
        </Head>
      </Fragment>
      <div className="page-title">
        <div className={styles.header}>
          <div className={styles["header-left"]}>
            <h3>Issues</h3>
            <div className={styles["services-select-container"]}>
              <ServicesMenu serviceList={serviceList} />
            </div>
            <div className={styles["active-filters"]}>
              {services !== null &&
                services.length > 0 &&
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
          {/* <div className={styles["header-right"]}>
            <CreateNewIssueDrawer services={serviceList} />
          </div> */}
        </div>
      </div>
      <div className={styles["page-content"]}>
        {/* @TODO - add error state here */}
        {selectedCluster !== null && !loading && issuesData?.issues != null ? (
          <TableX table={table} data={issuesData?.issues} />
        ) : (
          <CustomSkeleton
            containerClass={styles["skeleton-container"]}
            skeletonClass={styles.skeleton}
            len={10}
          />
        )}
      </div>
      {issuesData && (
        <div className={styles["pagination-container"]}>
          <PaginationX
            totalItems={issuesData.total_records}
            itemsPerPage={ISSUES_PAGE_SIZE}
          />
        </div>
      )}
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
