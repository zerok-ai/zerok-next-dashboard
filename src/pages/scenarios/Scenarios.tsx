import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import Head from "next/head";
import { useEffect } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { renderScenarioString } from "utils/scenarios/functions";
import { type ScenarioDetail } from "utils/scenarios/types";

import styles from "./Scenarios.module.scss";

const Scenarios = () => {
  const { data: scenarios, fetchData: fetchScenarios } = useFetch<
    ScenarioDetail[]
  >("scenarios", null);
  const { selectedCluster, renderTrigger } = useSelector(clusterSelector);
  useEffect(() => {
    if (selectedCluster) {
      fetchScenarios("/scenarios.json");
    }
  }, [selectedCluster, renderTrigger]);

  if (!scenarios) {
    return null;
  }

  return (
    <div className={styles.container}>
      {scenarios.map((scenario) => {
        return <p key={nanoid()}>{renderScenarioString(scenario.workloads)}</p>;
      })}
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
