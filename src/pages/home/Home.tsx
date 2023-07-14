import PrivateRoute from "components/PrivateRoute";
import styles from "./Home.module.scss";
import PageLayout from "components/layouts/PageLayout";
import { useEffect } from "react";
import Head from "next/head";
import { Skeleton } from "@mui/material";
import { LIST_SERVICES_ENDPOINT } from "utils/endpoints";
import { useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import { ServiceDetail } from "utils/types";
import ServiceCard from "components/ServiceCard";
import { nanoid } from "@reduxjs/toolkit";
import { filterServices } from "utils/functions";
import { useFetch } from "hooks/useFetch";

const Home = () => {
  const {
    data: services,
    fetchData: fetchServices,
    loading,
    error,
  } = useFetch<ServiceDetail[]>("results", null, filterServices);
  const { selectedCluster } = useSelector(clusterSelector);
  useEffect(() => {
    if (selectedCluster) {
      fetchServices(
        LIST_SERVICES_ENDPOINT.replace("{cluster_id}", selectedCluster)
      );
    }
  }, [selectedCluster]);

  const skeletons = new Array(8).fill("skeleton");

  if (!loading && services && services.length === 0) {
    return (
      <div className={styles["no-services"]}>
        <h3>No services found.</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["no-services"]}>
        <h3>Could not fetch services, please try again.</h3>
      </div>
    );
  }

  return (
    <div>
      <h3 className="page-title">Health</h3>
      <div className={styles["content-container"]}>
        <div className={styles["services-container"]}>
          {!loading && services
            ? services.map((sv) => {
                return (
                  <div className={styles["service"]} key={nanoid()}>
                    <ServiceCard service={sv} />
                  </div>
                );
              })
            : skeletons.map((sk) => {
                return (
                  <Skeleton
                    key={nanoid()}
                    variant="rectangular"
                    className={styles["skeleton"]}
                  />
                );
              })}
        </div>
      </div>
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
