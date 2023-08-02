import { nanoid } from "@reduxjs/toolkit";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import CustomSkeleton from "components/CustomSkeleton";
import PageLayout from "components/layouts/PageLayout";
import PageHeader from "components/PageHeader";
import PrivateRoute from "components/PrivateRoute";
import TableX from "components/themeX/TableX";
import TagX from "components/themeX/TagX";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { LIST_SERVICES_ENDPOINT } from "utils/endpoints";
import { filterServices } from "utils/functions";
import raxios from "utils/raxios";
import {
  GET_SCENARIO_DETAILS_ENDPOINT,
  LIST_SCENARIOS_ENDPOINT,
} from "utils/scenarios/endpoints";
import { type ScenarioDetail } from "utils/scenarios/types";
import { type ServiceDetail } from "utils/types";

import styles from "./IssuesPage.module.scss";
import { getIssueColumns } from "./IssuesPage.utils";

const IssuesPage = () => {
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);

  const [scenarios, setScenarios] = useState<ScenarioDetail[] | null>(null);

  const { fetchData: fetchServices } = useFetch<ServiceDetail[]>(
    "results",
    null,
    filterServices
  );

  const router = useRouter();

  const { query } = router;
  // const page = query.page ? parseInt(query.page as string) : 1;
  const range = query.range ?? DEFAULT_TIME_RANGE;
  const getData = async () => {
    try {
      const listScenariosResponse = await raxios.get(LIST_SCENARIOS_ENDPOINT, {
        headers: {
          "Cluster-Id": selectedCluster,
        },
      });
      const listScenarios: ScenarioDetail[] =
        listScenariosResponse.data.payload.scenarios;
      const scenarioIDs = listScenarios.map((sc) => sc.scenario_id);
      const scenarioDetailEndpoint = GET_SCENARIO_DETAILS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster as string
      )
        .replace("{scenario_id_list}", scenarioIDs.join(","))
        .replace("{range}", range as string);
      const scenarioDetails = (await raxios.get(scenarioDetailEndpoint)).data
        .payload.scenarios;
      const scenarioDetailsData: ScenarioDetail[] = listScenarios.map(
        (sc: ScenarioDetail) => {
          const sc1 = { ...sc };
          const sc2 =
            scenarioDetails.find(
              (sc3: ScenarioDetail) => sc3.scenario_id === sc1.scenario_id
            ) ?? {};
          const scenario: ScenarioDetail = {
            ...sc1,
            ...sc2,
          };
          return scenario;
        }
      );
      setScenarios(scenarioDetailsData);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    if (selectedCluster) {
      setScenarios(null);
      getData();
    }
  }, [selectedCluster, renderTrigger, router.query]);
  // @TODO - add types for filters here
  const services =
    query.services && query.services?.length > 0
      ? decodeURIComponent(query.services as string).split(",")
      : null;

  const columns = useMemo(() => {
    return getIssueColumns();
  }, [scenarios]);

  const table = useReactTable<ScenarioDetail>({
    columns,
    data: scenarios ?? [],
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
        {selectedCluster !== null && scenarios ? (
          <TableX table={table} data={scenarios ?? []} />
        ) : (
          <CustomSkeleton
            containerClass={styles["skeleton-container"]}
            skeletonClass={styles.skeleton}
            len={10}
          />
        )}
      </div>
      {/* {issuesData && (
        <div className={styles["pagination-container"]}>
          <PaginationX
            totalItems={issuesData.total_records}
            itemsPerPage={ISSUES_PAGE_SIZE}
          />
        </div>
      )} */}
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
