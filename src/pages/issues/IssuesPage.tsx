import { nanoid } from "@reduxjs/toolkit";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import CreateNewIssueDrawer from "components/CreateNewIssueDrawer";
import CustomSkeleton from "components/CustomSkeleton";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import TableX from "components/themeX/TableX";
import TagX from "components/themeX/TagX";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import {
  LIST_INCIDENTS_ENDPOINT,
  LIST_SERVICES_ENDPOINT_V2,
} from "utils/endpoints";
import { filterServices } from "utils/functions";
import { type IssueDetail, type ServiceDetail } from "utils/types";

import styles from "./IssuesPage.module.scss";
import ServicesMenu, { getIssueColumns } from "./IssuesPage.utils";

const IssuesPage = () => {
  const { selectedCluster } = useSelector(clusterSelector);
  const {
    loading,
    error,
    data: issues,
    fetchData: fetchIssues,
  } = useFetch<IssueDetail[]>("issues");

  const {
    loading: serviceListLoading,
    error: serviceListError,
    data: serviceList,
    fetchData: fetchServices,
  } = useFetch<ServiceDetail[]>("results", null, filterServices);

  const router = useRouter();

  const { query } = router;
  // @TODO - add types for filters here

  const services =
    (query.services as string).length > 0
      ? decodeURIComponent(query.services as string).split(",")
      : null;

  const columns = useMemo(() => {
    return getIssueColumns();
  }, [issues]);

  const table = useReactTable<IssueDetail>({
    columns,
    data: issues ?? [],
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
    if (selectedCluster !== null) {
      const filter =
        services != null && services.length > 0
          ? `?services=${services.join(",")}`
          : "";
      // @TODO - better handling of endpoints
      const endpoint =
        LIST_INCIDENTS_ENDPOINT.replace("{id}", selectedCluster) + filter;
      fetchIssues(endpoint);
      fetchServices(LIST_SERVICES_ENDPOINT_V2.replace("{id}", selectedCluster));
    }
  }, [selectedCluster, router]);

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
          <div className={styles["header-right"]}>
            <CreateNewIssueDrawer services={serviceList} />
          </div>
        </div>
      </div>
      <div className="page-content">
        {/* @TODO - add error state here */}
        {selectedCluster !== null && !loading && issues != null ? (
          <TableX table={table} data={issues} />
        ) : (
          <CustomSkeleton
            containerClass={styles["skeleton-container"]}
            skeletonClass={styles.skeleton}
            len={10}
          />
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
