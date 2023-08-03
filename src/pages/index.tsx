import { Button } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import HealthCards from "components/HealthCards";
import PageLayout from "components/layouts/PageLayout";
import MapToggle from "components/MapToggle";
import PageHeader from "components/PageHeader";
import PrivateRoute from "components/PrivateRoute";
import ServiceMapPage from "components/ServiceMapPage";
import Head from "next/head";
import { useCallback, useState } from "react";
import { HiPlus } from "react-icons/hi";

import styles from "./Home.module.scss";

const Home = () => {
  const [isHealthMap, setIsHealthMap] = useState(true);
  const [isMapFilterOpen, setIsMapFilterOpen] = useState(false);
  const toggleFilterDrawer = () => {
    setIsMapFilterOpen(!isMapFilterOpen);
  };
  const togglePage = () => {
    console.log("called");
    setIsHealthMap(!isHealthMap);
  };
  console.log({ isHealthMap });
  const MapFilterButton = () => {
    return (
      <Button
        variant="contained"
        color="secondary"
        className={styles["filters-btn"]}
        onClick={toggleFilterDrawer}
        key={nanoid()}
      >
        <HiPlus /> Filters
      </Button>
    );
  };
  const getExtras = useCallback(() => {
    return isHealthMap
      ? [
          <MapToggle
            active={isHealthMap}
            key={nanoid()}
            onChange={togglePage}
          />,
          <MapFilterButton key={nanoid()} />,
        ]
      : [
          <MapToggle
            active={isHealthMap}
            key={nanoid()}
            onChange={togglePage}
          />,
        ];
  }, [isHealthMap]);

  return (
    <div>
      <PageHeader title="Health" showRange showRefresh extras={getExtras()} />
      {!isHealthMap ? (
        <HealthCards />
      ) : (
        <ServiceMapPage
          toggleDrawer={toggleFilterDrawer}
          isFilterOpen={isMapFilterOpen}
        />
      )}
    </div>
  );
};

Home.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Home page</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default Home;
