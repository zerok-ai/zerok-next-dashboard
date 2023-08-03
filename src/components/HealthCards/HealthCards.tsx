import { Skeleton } from "@mui/material";
import ServiceCard from "components/ServiceCard";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { LIST_SERVICES_ENDPOINT } from "utils/endpoints";
import { filterServices } from "utils/functions";
import { type ServiceDetail } from "utils/types";

import styles from "./HealthCards.module.scss";

const HealthCards = () => {
  const {
    data: services,
    fetchData: fetchServices,
    loading,
    error,
  } = useFetch<ServiceDetail[]>("results", null, filterServices);
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const range = router.query.range ?? DEFAULT_TIME_RANGE;
  useEffect(() => {
    if (selectedCluster) {
      fetchServices(
        LIST_SERVICES_ENDPOINT.replace("{cluster_id}", selectedCluster).replace(
          "{range}",
          range as string
        )
      );
    }
  }, [selectedCluster]);

  const skeletons = new Array(8).fill("skeleton");

  if (!loading && services != null && services.length === 0) {
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
    <div className={styles["content-container"]}>
      <div className={styles["services-container"]}>
        {!loading && services != null
          ? services.map((sv) => {
              return (
                <div className={styles.service} key={nanoid()}>
                  <ServiceCard service={sv} />
                </div>
              );
            })
          : skeletons.map((sk) => {
              return (
                <Skeleton
                  key={nanoid()}
                  variant="rectangular"
                  className={styles.skeleton}
                />
              );
            })}
      </div>
    </div>
  );
};

export default HealthCards;
