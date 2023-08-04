import { Button } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import HealthCards from "components/HealthCards";
import PageHeader from "components/helpers/PageHeader";
import PageWrapper from "components/helpers/PageWrapper";
import MapToggle from "components/MapToggle";
import ServiceMapPage from "components/ServiceMapPage";
import { useToggle } from "hooks/useToggle";
import { useCallback, useMemo } from "react";
import { HiPlus } from "react-icons/hi";

import styles from "./Home.module.scss";

const Home = () => {
  const [isHealthMap, toggleHealthMap] = useToggle(true);
  const [isMapFilterOpen, toggleMapFilter] = useToggle(false);
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
      />
    );
  }, [isHealthMap]);

  const getExtras = useCallback(() => {
    return isHealthMap ? [MapToggleMemo, MapFilterButton] : [MapToggleMemo];
  }, [isHealthMap]);

  return (
    <div>
      <PageHeader title="Health" showRange showRefresh extras={getExtras()} />
      {isHealthMap ? (
        <ServiceMapPage
          toggleDrawer={toggleMapFilter}
          isFilterOpen={isMapFilterOpen}
        />
      ) : (
        <HealthCards />
      )}
    </div>
  );
};

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <PageWrapper title="ZeroK Dashboard | Health">{page}</PageWrapper>;
};

export default Home;
