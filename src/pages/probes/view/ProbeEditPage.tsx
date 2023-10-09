import CustomSkeleton from "components/custom/CustomSkeleton";
import ProbeCreateForm from "components/forms/ProbeCreateForm";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { clusterSelector } from "redux/cluster";
import { scenarioToProbeForm } from "utils/probes/functions";
import { PROBE_PAGE_SIZE } from "utils/scenarios/constants";
import { LIST_SCENARIOS_ENDPOINT } from "utils/scenarios/endpoints";
import { type ScenarioDetailType } from "utils/scenarios/types";

import styles from "./ProbeEditPage.module.scss";

const ProbeEditPage = () => {
  const { data: probes, fetchData: fetchProbes } =
    useFetch<ScenarioDetailType[]>("scenarios");
  const [probe, setProbe] = useState<ScenarioDetailType | null>(null);
  const router = useRouter();
  const { selectedCluster } = useSelector(clusterSelector);
  useEffect(() => {
    const { id } = router.query;
    if (router.isReady && selectedCluster && id) {
      const endpoint = LIST_SCENARIOS_ENDPOINT.replace(
        "{limit}",
        PROBE_PAGE_SIZE.toString()
      ).replace("{offset}", "0".replace("{cluster_id}", selectedCluster));
      fetchProbes(endpoint);
    }
    if (router.isReady && !id) {
      router.push("/probes");
    }
  }, [router, selectedCluster]);

  useEffect(() => {
    if (probes?.length) {
      const { id } = router.query;
      const probe = probes.find((probe) => probe.scenario.scenario_id === id);
      if (probe) {
        setProbe(probe);
      } else {
        router.push("/probes");
      }
    }
  }, [probes]);

  return (
    <div className={styles.container}>
      <PageHeader
        showRange={false}
        title={probe?.scenario.scenario_title ?? ""}
        loading={!probe}
        showRefresh={false}
        showBreadcrumb
      />
      {probe ? (
        <ProbeCreateForm edit={scenarioToProbeForm(probe)} />
      ) : (
        <CustomSkeleton len={10} />
      )}
    </div>
  );
};

ProbeEditPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | View Probe</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default ProbeEditPage;
