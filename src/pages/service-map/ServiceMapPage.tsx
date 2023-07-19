import { useFetch } from "hooks/useFetch";
import styles from "./ServiceMap.module.scss";
import { ServiceMapDetail } from "utils/health/types";
import { useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import { useEffect, useState } from "react";
import { GET_SERVICE_MAP_ENDPOINT } from "utils/health/endpoints";
import PrivateRoute from "components/PrivateRoute";
import Head from "next/head";
import PageLayout from "components/layouts/PageLayout";
import { filterEmptyServiceMapNodes } from "utils/health/functions";
import HealthMap from "components/HealthMap";
import { getServiceString } from "utils/services/functions";
import { HiPlus } from "react-icons/hi";
import { IGNORED_SERVICES_PREFIXES } from "utils/constants";
import { Button } from "@mui/material";
import DrawerX from "components/themeX/DrawerX";
import HealthMapFilterForm from "components/HealthMapFilterForm";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import { useRouter } from "next/router";
import ChipX from "components/themeX/ChipX";
import TagX from "components/themeX/TagX";
import ServiceMapFilterDisplay from "components/ServiceMapFilterDisplay";

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

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const toggleFilterDrawer = () => setIsFilterDrawerOpen(!isFilterDrawerOpen);
  useEffect(() => {
    if (selectedCluster) {
      fetchData(
        GET_SERVICE_MAP_ENDPOINT.replace("{cluster_id}", selectedCluster)
      );
    }
  }, [selectedCluster]);

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <h3 className="page-title">Health</h3>
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
      <div className={styles["content"]}>
        <ReactFlowProvider>
          <HealthMap serviceMap={data} />
        </ReactFlowProvider>
      </div>
      {isFilterDrawerOpen && data && (
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
