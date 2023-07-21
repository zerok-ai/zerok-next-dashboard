import { Button } from "@mui/material";
import HealthMap from "components/HealthMap";
import HealthMapFilterForm from "components/HealthMapFilterForm";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import ServiceMapFilterDisplay from "components/ServiceMapFilterDisplay";
import DrawerX from "components/themeX/DrawerX";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { ReactFlowProvider } from "reactflow";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { IGNORED_SERVICES_PREFIXES } from "utils/constants";
import { GET_SERVICE_MAP_ENDPOINT } from "utils/health/endpoints";
import { filterEmptyServiceMapNodes } from "utils/health/functions";
import { type ServiceMapDetail } from "utils/health/types";
import { getServiceString } from "utils/services/functions";

import styles from "./ServiceMap.module.scss";

const formatServiceMapData = (smap: ServiceMapDetail[]) => {
  const filteredServices = smap.filter((service) => {
    return (
      !IGNORED_SERVICES_PREFIXES.includes(service.requestor_service) &&
      !IGNORED_SERVICES_PREFIXES.includes(service.responder_service)
    );
  });
  const nonEmptyServices = filterEmptyServiceMapNodes(filteredServices);
  const formattedServices = nonEmptyServices.map((service) => {
    if (service.requestor_service.length > 0) {
      service.requestor_service = getServiceString(service.requestor_service);
    }
    if (service.responder_service.length > 0) {
      service.responder_service = getServiceString(service.responder_service);
    }
    return service;
  });
  return formattedServices;
};

const ServiceMap = () => {
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const { loading, error, data, fetchData } = useFetch<ServiceMapDetail[]>(
    "results",
    null,
    formatServiceMapData
  );

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
  };
  useEffect(() => {
    if (selectedCluster) {
      const { namespaces, serviceNames } = router.query;
      const params = queryString.stringify({
        ns: namespaces,
        svc: serviceNames,
        st: "-24h",
      });
      fetchData(
        GET_SERVICE_MAP_ENDPOINT.replace("{cluster_id}", selectedCluster) +
          params
      );
    }
  }, [selectedCluster, router]);

  return (
    <div className={styles.container}>
      <h3 className="page-title">Health</h3>
      <div className={styles.header}>
        <div className={styles["header-left"]}>
          <ServiceMapFilterDisplay />
        </div>
        <div className={styles["header-right"]}>
          <Button
            variant="contained"
            color="secondary"
            className={styles["filters-btn"]}
            onClick={toggleFilterDrawer}
          >
            <HiPlus /> Filters
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <ReactFlowProvider>
          <HealthMap serviceMap={data} />
        </ReactFlowProvider>
      </div>
      {isFilterDrawerOpen && data != null && (
        <DrawerX title="Filter" onClose={toggleFilterDrawer}>
          <HealthMapFilterForm
            serviceList={data}
            onFinish={toggleFilterDrawer}
          />
        </DrawerX>
      )}
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
