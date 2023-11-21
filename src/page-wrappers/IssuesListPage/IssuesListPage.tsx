import { type ColumnSort } from "@tanstack/react-table";
import ValidClusterWrapper from "components/clusters/ValidClusterWrapper";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import TableFilter from "components/helpers/TableFilter";
import PageLayout from "components/layouts/PageLayout";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
// import TagX from "components/themeX/TagX";
import { useFetch } from "hooks/useFetch";
import { useZkFlag } from "hooks/useZkFlag";
// import { useTrigger } from "hooks/useTrigger";
import { useRouter } from "next/router";
// import queryString from "query-string";
import { Fragment, useEffect, useMemo, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { LIST_ISSUES_ENDPOINT } from "utils/endpoints";
import { ISSUES_PAGE_SIZE } from "utils/issues/constants";
import { type IssueDetail } from "utils/types";

import styles from "./IssuesListPage.module.scss";
import { getIssueColumns, ISSUE_SORT_OPTIONS } from "./IssuesListPage.utils";

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

  const {
    data,
    fetchData: fetchIssues,
    error,
    setData,
  } = useFetch<IssuesDataType>("", null);

  const [totalItems, setTotalItems] = useState<number | null>(0);

  const router = useRouter();

  const { query } = router;
  const page = query.page ? parseInt(query.page as string) : 1;
  const range = query.range ?? DEFAULT_TIME_RANGE;
  const [sortBy, setSortBy] = useState<ColumnSort[]>([DEFAULT_SORT]);
  const zkChatEnabled = useZkFlag("org", "gpt", "zkchat").enabled;
  const getIssues = async () => {
    setData(null);
    // const filter = services && services.length > 0 ? services.join(",") : "";
    // const serviceFilter = filter.length > 0 ? { services: filter } : {};
    // const params = queryString.stringify({
    //   ...serviceFilter,
    // });
    const endpoint = LIST_ISSUES_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster!
    )
      .replace("{range}", range as string)
      .replace("{limit}", ISSUES_PAGE_SIZE.toString())
      .replace("{offset}", ((page - 1) * ISSUES_PAGE_SIZE).toString());
    fetchIssues(endpoint);
  };

  useEffect(() => {
    if (selectedCluster) {
      getIssues();
    }
  }, [selectedCluster, router.query]);

  useEffect(() => {
    if (data) {
      setTotalItems(data.total_records);
    }
  }, [data]);

  // @TODO - add types for filters here
  // const services =
  //   query.services && query.services?.length > 0
  //     ? decodeURIComponent(query.services as string).split(",")
  //     : null;

  const columns = useMemo(() => {
    return getIssueColumns(zkChatEnabled);
  }, [data?.issues, zkChatEnabled]);

  // const removeService = (label: string) => {
  //   if (services != null) {
  //     const filtered = services.filter((sv) => sv !== label);
  //     const newQuery = { ...query };
  //     if (filtered.length > 0) {
  //       newQuery.services = filtered.join(",");
  //     } else delete newQuery.services;
  //     router.push({
  //       pathname: "/issues",
  //       query: {
  //         ...newQuery,
  //       },
  //     });
  //   }
  // };

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
    <Fragment>
      <PageHeader
        htmlTitle="Issues"
        title="Issues"
        showRange={true}
        showRefresh={true}
        leftExtras={leftExtras}
        onRefresh={getIssues}
      />
      <ValidClusterWrapper>
        {/* Rendering filters
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
        )} */}
        <div className={styles["page-content"]}>
          {error && <p>Error fetching issues. Please try again later.</p>}
          {selectedCluster && !error && (
            <TableX
              data={data ? data.issues : null}
              columns={columns}
              sortBy={sortBy}
              onSortingChange={setSortBy}
            />
          )}
        </div>

        <footer className={styles["pagination-container"]}>
          <PaginationX
            totalItems={totalItems ?? 0}
            itemsPerPage={ISSUES_PAGE_SIZE}
          />
        </footer>
      </ValidClusterWrapper>
    </Fragment>
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
