import CustomSkeleton from "components/custom/CustomSkeleton";
import ProbeCreateForm from "components/forms/ProbeCreateForm";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { clusterSelector } from "redux/cluster";
import { scenarioToProbeForm } from "utils/probes/functions";
import { GET_SCENARIO_ENDPOINT } from "utils/scenarios/endpoints";
import { type ScenarioDetail } from "utils/scenarios/types";

import styles from "./ProbeEditPage.module.scss";

const ProbeEditPage = () => {
  const { data: probe, fetchData: fetchProbe } =
    useFetch<ScenarioDetail>("scenario");
  const router = useRouter();
  const { selectedCluster } = useSelector(clusterSelector);
  useEffect(() => {
    const { id } = router.query;
    if (router.isReady && selectedCluster && id) {
      const endpoint = GET_SCENARIO_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      ).replace("{scenario_id}", id as string);
      fetchProbe(endpoint);
    }
    if (router.isReady && !id) {
      router.push("/probes");
    }
  }, [router, selectedCluster]);

  return (
    <div className={styles.container}>
      <PageHeader
        showRange={false}
        title={probe?.scenario_title ?? ""}
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
