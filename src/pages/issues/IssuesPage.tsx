import { nanoid } from "@reduxjs/toolkit";
import { type ColumnSort } from "@tanstack/react-table";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import TableFilter from "components/helpers/TableFilter";
import PageLayout from "components/layouts/PageLayout";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
import TagX from "components/themeX/TagX";
import { useFetch } from "hooks/useFetch";
import { useTrigger } from "hooks/useTrigger";
import { useRouter } from "next/router";
import queryString from "query-string";
import { useEffect, useMemo, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { LIST_ISSUES_ENDPOINT } from "utils/endpoints";
import { ISSUES_PAGE_SIZE } from "utils/issues/constants";
import { type IssueDetail } from "utils/types";

import styles from "./IssuesPage.module.scss";
import { getIssueColumns, ISSUE_SORT_OPTIONS } from "./IssuesPage.utils";

interface IssuesDataType {
  issues: IssueDetail[];
  total_records: number;
}

const DEFAULT_SORT: ColumnSort = {
  id: ISSUE_SORT_OPTIONS[0].value.split(":")[0],
  desc: ISSUE_SORT_OPTIONS[0].value.split(":")[1] === "desc",
};

const IssuesPage = () => {
  const { selectedCluster } = useSelector(clusterSelector);

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

  const { trigger, changeTrigger } = useTrigger();
  const [sortBy, setSortBy] = useState<ColumnSort[]>([DEFAULT_SORT]);

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
  }, [selectedCluster, router.query, trigger]);

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

  const leftExtras = useMemo(() => {
    return [
      <TableFilter
        key={"table-filter"}
        options={ISSUE_SORT_OPTIONS}
        sortBy={sortBy[0]}
        onChange={(value) => {
          setSortBy([value]);
        }}
      />,
    ];
  }, [sortBy]);

  return (
    <div>
      <PageHeader
        htmlTitle="Issues"
        title="Issues"
        showRange={true}
        showRefresh={true}
        leftExtras={leftExtras}
        onRefresh={changeTrigger}
      />
      {/* Rendering filters */}
      {services && (
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
      )}
      <div className={styles["page-content"]}>
        {/* @TODO - add error state here */}
        {selectedCluster && (
          <TableX
            data={data?.issues ?? null}
            columns={columns}
            sortBy={sortBy}
            onSortingChange={setSortBy}
          />
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
