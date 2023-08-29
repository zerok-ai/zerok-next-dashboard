import { Button } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import HealthCards from "components/HealthCards";
import PageHeader from "components/helpers/PageHeader";
import PageWrapper from "components/helpers/PageWrapper";
import MapToggle from "components/MapToggle";
import ServiceMapPage from "components/ServiceMapPage";
import UnderConstruction from "components/UnderConstruction";
import { useToggle } from "hooks/useToggle";
import { useCallback, useMemo } from "react";
import { HiPlus } from "react-icons/hi";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { CLUSTER_STATES } from "utils/constants";

import styles from "./Home.module.scss";

const Home = () => {
  const [isHealthMap, toggleHealthMap] = useToggle(true);
  const [isMapFilterOpen, toggleMapFilter] = useToggle(false);
  const { status, selectedCluster } = useSelector(clusterSelector);
  const healthyCluster = selectedCluster
    ? status === CLUSTER_STATES.HEALTHY
    : true;
  const MapFilterButton = useMemo(() => {
    return (
      <Button
        variant="contained"
        color="secondary"
        className={styles["filters-btn"]}
        onClick={toggleMapFilter}
        key={nanoid()}
      >
        <HiPlus /> Filters
      </Button>
    );
  }, [toggleMapFilter]);

  const MapToggleMemo = useMemo(() => {
    return (
      <MapToggle
        active={isHealthMap}
        key={nanoid()}
        onChange={toggleHealthMap}
        title="Toggle map view"
      />
    );
  }, [isHealthMap]);

  const getExtras = useCallback(() => {
    return isHealthMap ? [MapToggleMemo, MapFilterButton] : [MapToggleMemo];
  }, [isHealthMap]);

  return (
    <div>
      <PageHeader
        title="Health"
        showRange={!!healthyCluster}
        showRefresh={!!healthyCluster}
        extras={healthyCluster ? getExtras() : []}
      />
      {healthyCluster ? (
        isHealthMap ? (
          <ServiceMapPage
            toggleDrawer={toggleMapFilter}
            isFilterOpen={isMapFilterOpen}
          />
        ) : (
          <HealthCards />
        )
      ) : (
        <UnderConstruction altTitle="Please select a healthy cluster or add a new cluster to continue." />
      )}
    </div>
  );
};

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <PageWrapper title="ZeroK Dashboard | Health">{page}</PageWrapper>;
};

export default Home;
