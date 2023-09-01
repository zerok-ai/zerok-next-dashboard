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

interface HealthCardProps {
  filter: string;
}

const HealthCards = ({ filter }: HealthCardProps) => {
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
        <h6>Could not fetch services, please try again.</h6>
      </div>
    );
  }
  const filteredServices =
    services && services.length > 0
      ? services.filter((sv) => sv.service.includes(filter))
      : services;
  return (
    <div className={styles["content-container"]}>
      <div className={styles["services-container"]}>
        {!loading && filteredServices != null
          ? filteredServices.map((sv) => {
              return (
                <div className={styles.service} key={nanoid()}>
                  <ServiceCard service={sv} />
                </div>
              );
            })
          : skeletons.map(() => {
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
