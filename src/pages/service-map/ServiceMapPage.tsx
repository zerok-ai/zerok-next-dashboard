import { useFetch } from "hooks/useFetch";
import styles from "./ServiceMap.module.scss";
import { ServiceMapDetail } from "utils/health/types";
import { useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import { useEffect } from "react";
import { GET_SERVICE_MAP_ENDPOINT } from "utils/health/endpoints";
import PrivateRoute from "components/PrivateRoute";
import Head from "next/head";
import PageLayout from "components/layouts/PageLayout";
import { filterEmptyServiceMapNodes } from "utils/health/functions";
import HealthMap from "components/HealthMap";
import { getServiceString } from "utils/services/functions";
import { IGNORED_SERVICES_PREFIXES } from "utils/constants";

const formatServiceMapData = (smap: ServiceMapDetail[]) => {
  const filteredServices = smap.filter((service) => {
    return !IGNORED_SERVICES_PREFIXES.includes(
      service.requestor_service || service.responder_service
    );
  });
  const nonEmptyServices = filterEmptyServiceMapNodes(filteredServices);
  const formattedServices = nonEmptyServices.map((service) => {
    if (service.requestor_service) {
      service.requestor_service = getServiceString(service.requestor_service);
    }
    if (service.responder_service) {
      service.responder_service = getServiceString(service.responder_service);
    }
    return service;
  });
  return formattedServices;
};

const ServiceMap = () => {
  const { selectedCluster } = useSelector(clusterSelector);
  const { loading, error, data, fetchData } = useFetch<ServiceMapDetail[]>(
    "results",
    null,
    formatServiceMapData
  );

  useEffect(() => {
    if (selectedCluster) {
      fetchData(
        GET_SERVICE_MAP_ENDPOINT.replace("{cluster_id}", selectedCluster)
      );
    }
  }, [selectedCluster]);

  return (
    <div className={styles["container"]}>
      <HealthMap serviceMap={data} />
    </div>
  );
};

ServiceMap.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Service Map</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default ServiceMap;
