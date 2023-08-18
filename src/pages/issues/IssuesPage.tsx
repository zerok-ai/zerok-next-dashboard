import { nanoid } from "@reduxjs/toolkit";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import CustomSkeleton from "components/CustomSkeleton";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
import TagX from "components/themeX/TagX";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
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

  const { fetchData: fetchServices } = useFetch<ServiceDetail[]>(
    "results",
    null,
    filterServices
  );

  const router = useRouter();

  const { query } = router;
  const page = query.page ? parseInt(query.page as string) : 1;
  const range = query.range ?? DEFAULT_TIME_RANGE;

  // const getData = async () => {
  //   try {
  //     const listScenariosResponse = await raxios.get(LIST_SCENARIOS_ENDPOINT, {
  //       headers: {
  //         "Cluster-Id": selectedCluster,
  //       },
  //     });
  //     const listScenarios: ScenarioDetail[] =
  //       listScenariosResponse.data.payload.scenarios;
  //     const scenarioIDs = listScenarios.map((sc) => sc.scenario_id);
  //     const scenarioDetailEndpoint = GET_SCENARIO_DETAILS_ENDPOINT.replace(
  //       "{cluster_id}",
  //       selectedCluster as string
  //     )
  //       .replace("{scenario_id_list}", scenarioIDs.join(","))
  //       .replace("{range}", range as string);
  //     const scenarioDetails = (await raxios.get(scenarioDetailEndpoint)).data
  //       .payload.scenarios;
  //     const scenarioDetailsData: ScenarioDetail[] = listScenarios.map(
  //       (sc: ScenarioDetail) => {
  //         const sc1 = { ...sc };
  //         const sc2 =
  //           scenarioDetails.find(
  //             (sc3: ScenarioDetail) => sc3.scenario_id === sc1.scenario_id
  //           ) ?? {};
  //         const scenario: ScenarioDetail = {
  //           ...sc1,
  //           ...sc2,
  //         };
  //         return scenario;
  //       }
  //     );
  //     // filter empty scenarios
  //     const filteredScenarios = scenarioDetailsData.filter((sc) => {
  //       return sc.last_seen && sc.first_seen;
  //     });
  //     setScenarios(filteredScenarios);
  //   } catch (err) {
  //     console.log({ err });
  //   }
  // };

  // useEffect(() => {
  //   if (selectedCluster) {
  //     setScenarios(null);
  //     getData();
  //   }
  // }, [selectedCluster, renderTrigger, router.query]);

  useEffect(() => {
    if (selectedCluster) {
      setData(null);
      fetchIssues(
        LIST_ISSUES_ENDPOINT.replace("{cluster_id}", selectedCluster)
          .replace("{range}", range as string)
          .replace("{limit}", ISSUES_PAGE_SIZE.toString())
          .replace("{offset}", ((page - 1) * ISSUES_PAGE_SIZE).toString())
      );
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

  const table = useReactTable<IssueDetail>({
    columns,
    data: data?.issues ?? [],
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
      // const filter = services && services.length > 0 ? services.join(",") : "";
      const range = query.range ?? DEFAULT_TIME_RANGE;
      // const serviceFilter = filter.length > 0 ? { services: filter } : {};
      // const params = queryString.stringify({
      //   ...serviceFilter,
      //   limit: ISSUES_PAGE_SIZE,
      //   offset: (page - 1) * ISSUES_PAGE_SIZE,
      //   st: range,
      // });
      fetchServices(
        LIST_SERVICES_ENDPOINT.replace("{cluster_id}", selectedCluster).replace(
          "{range}",
          range as string
        )
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
        {selectedCluster !== null && data?.issues ? (
          <TableX table={table} data={data?.issues ?? []} />
        ) : (
          <CustomSkeleton
            containerClass={styles["skeleton-container"]}
            skeletonClass={styles.skeleton}
            len={10}
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
