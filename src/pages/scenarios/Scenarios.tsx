import PrivateRoute from "components/PrivateRoute";
// import styles from "./Scenarios.module.scss";
import Head from "next/head";
import PageLayout from "components/layouts/PageLayout";
import { useFetch } from "hooks/useFetch";
import { useEffect } from "react";
import { useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import { renderScenarioString } from "utils/scenarios/functions";
import { type ScenarioDetail } from "utils/scenarios/types";
import { nanoid } from "nanoid";

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
    <div>
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
