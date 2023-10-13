// MUI
import { Button } from "@mui/material";
// redux
import { nanoid } from "@reduxjs/toolkit";
// custom
import HealthCards from "components/health-page/HealthCards";
import ServiceMapPage from "components/health-page/ServiceMapPage";
import MapToggle from "components/helpers/MapToggle";
import PageHeader from "components/helpers/PageHeader";
import PageWrapper from "components/helpers/PageWrapper";
import SearchBar from "components/helpers/SearchBar";
// hooks
import { useToggle } from "hooks/useToggle";
import { useTrigger } from "hooks/useTrigger";
// react
import { Fragment, useCallback, useMemo, useState } from "react";
// icons
import { HiPlus } from "react-icons/hi";
// redux
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
// utils
import { CLUSTER_STATES } from "utils/constants";

import styles from "./Home.module.scss";

const Home = () => {
  const [isHealthMap, toggleHealthMap] = useToggle(true);
  const [isMapFilterOpen, toggleMapFilter] = useToggle(false);
  const [cardFilter, setCardFilter] = useState("");
  const { status, selectedCluster } = useSelector(clusterSelector);
  const healthyCluster = selectedCluster
    ? status === CLUSTER_STATES.HEALTHY
    : true;
  const { trigger: cardTrigger, changeTrigger: changeCardTrigger } =
    useTrigger();
  const { trigger: mapTrigger, changeTrigger: changeMapTrigger } = useTrigger();
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

  const CardFilterSearch = useMemo(() => {
    return (
      <SearchBar
        onChange={(val) => {
          setCardFilter(val);
        }}
        key="search-bar"
        inputState={cardFilter}
        placeholder="Search by service name"
      />
    );
  }, [cardFilter]);

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
    return isHealthMap
      ? [MapToggleMemo, MapFilterButton]
      : [MapToggleMemo, CardFilterSearch];
  }, [isHealthMap, cardFilter]);

  return (
    <Fragment>
      <PageHeader
        title="Services"
        showRange={isHealthMap}
        showRefresh={true}
        leftExtras={healthyCluster ? getExtras() : []}
        onRefresh={() => {
          isHealthMap ? changeMapTrigger() : changeCardTrigger();
        }}
      />
      {isHealthMap ? (
        <ServiceMapPage
          toggleDrawer={toggleMapFilter}
          isFilterOpen={isMapFilterOpen}
          trigger={mapTrigger}
        />
      ) : (
        <HealthCards filter={cardFilter} trigger={cardTrigger} />
      )}
    </Fragment>
  );
};

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <PageWrapper title="ZeroK Dashboard | Health">{page}</PageWrapper>;
};

export default Home;
