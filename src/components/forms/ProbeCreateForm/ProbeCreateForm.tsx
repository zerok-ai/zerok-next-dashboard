import { Button } from "@mui/material";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { LIST_SERVICES_ENDPOINT } from "utils/endpoints";
import {
  filterServices,
  getFormattedServiceName,
  getNamespace,
} from "utils/functions";
import { type ServiceDetail } from "utils/types";

import ConditionCard from "./helpers/ConditionCard";
import GroupBySelect from "./helpers/GroupBySelect";
import NameAndTimeForm from "./helpers/NameAndTimeForm";
import NotificationForm from "./helpers/NotificationForm";
import styles from "./ProbeCreateForm.module.scss";

const formatServices = (services: ServiceDetail[]) => {
  return services.map((sv) => {
    return {
      label: `${getNamespace(sv.service)}/${getFormattedServiceName(
        sv.service
      )}`,
      value: `${getNamespace(sv.service)}/${getFormattedServiceName(
        sv.service
      )}`,
    };
  });
};

const ProbeCreateForm = () => {
  const [cards, setCards] = useState<string[]>([nanoid()]);
  const { selectedCluster } = useSelector(clusterSelector);
  const { data: services, fetchData: fetchServices } = useFetch<
    ServiceDetail[]
  >("results", null, filterServices);

  useEffect(() => {
    if (selectedCluster) {
      const endpoint = LIST_SERVICES_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      ).replace("{range}", DEFAULT_TIME_RANGE);
      fetchServices(endpoint);
    }
  }, [selectedCluster]);
  const addCard = () => {
    setCards([...cards, nanoid()]);
  };

  const deleteCard = (idx: number) => {
    setCards(cards.filter((_, i) => i !== idx));
  };
  return (
    <div className={styles.container}>
      <div className={styles["cards-container"]}>
        {cards.map((c, idx) => {
          return (
            <ConditionCard
              includeAnd={idx > 0}
              key={nanoid()}
              services={formatServices(services ?? [])}
              deleteCard={
                idx > 0
                  ? () => {
                      deleteCard(idx);
                    }
                  : null
              }
            />
          );
        })}
      </div>
      <Button
        color="secondary"
        variant="contained"
        className={styles["add-card-btn"]}
        onClick={addCard}
      >
        Add service <HiOutlinePlus />
      </Button>
      <div className={styles.divider}></div>
      <GroupBySelect />
      <div className={styles.divider}></div>
      <NotificationForm />
      <div className={styles.divider}></div>
      <NameAndTimeForm />
      <Link href="/probes">
        <Button variant="contained" className={styles["create-button"]}>
          Investigate
        </Button>
      </Link>
    </div>
  );
};

export default ProbeCreateForm;
