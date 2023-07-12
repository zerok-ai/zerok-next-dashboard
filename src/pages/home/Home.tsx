import PrivateRoute from "components/PrivateRoute";
import styles from "./Home.module.scss";
import PageLayout from "components/layouts/PageLayout";
import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { CircularProgress, Skeleton } from "@mui/material";
import useStatus from "hooks/useStatus";
import {
  LIST_SERVICES_ENDPOINT,
  LIST_SERVICES_ENDPOINT_V2,
} from "utils/endpoints";
import { useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import axios from "axios";
import { ServiceDetail } from "utils/types";
import { IGNORED_SERVICES_PREFIXES } from "utils/constants";
import ServiceCard from "components/ServiceCard";
import { nanoid } from "@reduxjs/toolkit";
import { getNamespace } from "utils/functions";
import raxios from "utils/raxios";
import { useRouter } from "next/router";

const Home = () => {
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();

  const { status, setStatus } = useStatus();
  const fetchServices = useCallback(async () => {
    if (!selectedCluster) return;
    try {
      setStatus({ loading: true, error: null });
      const rdata = await raxios.get(
        LIST_SERVICES_ENDPOINT_V2.replace("{id}", selectedCluster)
      );
      const totalServices = rdata.data.payload.results as ServiceDetail[];
      if (!!totalServices.length) {
        setServices(
          totalServices.filter(
            (sv) =>
              !IGNORED_SERVICES_PREFIXES.includes(getNamespace(sv.service))
          )
        );
      } else {
        setServices([]);
      }
    } catch (err) {
      setStatus((old) => ({ ...old, loading: false }));
    } finally {
      setStatus((old) => ({ ...old, loading: false }));
    }
  }, [selectedCluster]);
  useEffect(() => {
    fetchServices();
  }, [selectedCluster, router]);

  const skeletons = new Array(8).fill("skeleton");

  return (
    <div>
      <h3 className="page-title">Health</h3>
      <div className={styles["content-container"]}>
        {/* <Button variant="contained" className={styles["services-btn"]}>
          All services
        </Button> */}
        <div className={styles["services-container"]}>
          {!!services.length
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
