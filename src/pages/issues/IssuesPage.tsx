import { nanoid } from "@reduxjs/toolkit";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import PaginationX from "components/themeX/PaginationX";
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
import { LIST_ISSUES_ENDPOINT } from "utils/endpoints";
import { ISSUES_PAGE_SIZE } from "utils/issues/constants";
import { type IssueDetail } from "utils/types";

import styles from "./IssuesPage.module.scss";
import { getIssueColumns } from "./IssuesPage.utils";

interface IssuesDataType {
  issues: IssueDetail[];
  total_records: number;
}

const IssuesPage = () => {
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);

  // const [scenarios, setScenarios] = useState<ScenarioDetail[] | null>(null);

  const {
    data,
    fetchData: fetchIssues,
    setData,
  } = useFetch<IssuesDataType>("", null);

  const router = useRouter();

  const { query } = router;
  const page = query.page ? parseInt(query.page as string) : 1;
  const range = query.range ?? DEFAULT_TIME_RANGE;

  useEffect(() => {
    if (selectedCluster) {
      setData(null);
      const filter = services && services.length > 0 ? services.join(",") : "";
      const serviceFilter = filter.length > 0 ? { services: filter } : {};
      const params = queryString.stringify({
        ...serviceFilter,
      });
      const endpoint =
        LIST_ISSUES_ENDPOINT.replace("{cluster_id}", selectedCluster)
          .replace("{range}", range as string)
          .replace("{limit}", ISSUES_PAGE_SIZE.toString())
          .replace("{offset}", ((page - 1) * ISSUES_PAGE_SIZE).toString()) +
        `${params.length ? `&${params}` : ""}`;
      fetchIssues(endpoint);
    }
  }, [selectedCluster, router.query, renderTrigger]);

  // @TODO - add types for filters here
  const services =
    query.services && query.services?.length > 0
      ? decodeURIComponent(query.services as string).split(",")
      : null;

  const columns = useMemo(() => {
    return getIssueColumns();
  }, [data?.issues]);

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

  return (
    <div>
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Issues</title>
        </Head>
      </Fragment>
      <PageHeader
        title="Issues"
        showRange={true}
        showRefresh={true}
        // extras={[<ServicesFilter serviceList={serviceList} key={nanoid()} />]}
      />
      {/* Rendering filters */}
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
      <div className={styles["page-content"]}>
        {/* @TODO - add error state here */}
        {selectedCluster && (
          <TableX data={data?.issues ?? null} columns={columns} />
        )}
      </div>
      {data?.issues && (
        <div className={styles["pagination-container"]}>
          <PaginationX
            totalItems={data.total_records}
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
