import { Checkbox } from "@mui/material";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import TableX from "components/themeX/TableX";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
// import { useRouter } from "next/router";
import { useEffect } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { type ScenarioDetail } from "utils/scenarios/types";

import styles from "./Scenarios.module.scss";

const Scenarios = () => {
  const { data: scenarios, fetchData: fetchScenarios } = useFetch<
    ScenarioDetail[]
  >("scenarios", null);
  // const router = useRouter();
  // const range = router.query.range ?? DEFAULT_TIME_RANGE;
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);
  useEffect(() => {
    if (selectedCluster) {
      // fetchScenarios(
      //   LIST_SCENARIOS_ENDPOINT.replace(
      //     "{cluster_id}",
      //     selectedCluster
      //   ).replace("{range}", range as string)
      // );
      fetchScenarios("/scenarios.json");
    }
  }, [selectedCluster, renderTrigger]);

  const helper = createColumnHelper<ScenarioDetail>();

  const columns = [
    helper.accessor("scenario_id", {
      header: "ID",
      size: DEFAULT_COL_WIDTH / 4,
    }),
    helper.accessor("scenario_title", {
      header: "Issue",
    }),
    helper.accessor("scenario_type", {
      header: "Type",
    }),
    helper.accessor("enabled", {
      cell: (info) => {
        return <Checkbox checked={info.row.original.enabled} />;
      },
    }),
  ];

  const table = useReactTable({
    data: scenarios ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!scenarios) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* {scenarios.map((scenario) => {
        return <p key={nanoid()}>{renderScenarioString(scenario.workloads)}</p>;
      })} */}
      <h3 className={"page-title"}>Issues</h3>
      <TableX table={table} data={scenarios} />
    </div>
  );
};

Scenarios.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Scenarios</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default Scenarios;
