import { MenuItem, Select, Tab, Tabs } from "@mui/material";
import CustomSkeleton from "components/CustomSkeleton";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import {
  GET_POD_CONTAINERS_ENDPOINT,
  GET_POD_METRICS_ENDPOINT,
  GET_PODS_ENDPOINT,
} from "utils/pods/endpoints";
import {
  type ContainerInfoType,
  type PodDetailResponseType,
  type PodInfoType,
} from "utils/pods/types";

import styles from "./PodDetailsCard.module.scss";
import {
  ContainerMetadata,
  POD_CONTAINERS,
  POD_METADATA,
  POD_METRICS,
  POD_TABS,
  PodChart,
  PodMetadata,
} from "./PodDetailsCard.utils";

const PodDetailsCard = () => {
  const { data: pods, fetchData: fetchPods } =
    useFetch<PodInfoType[]>("pods_info");
  const { data: podDetails, fetchData: fetchPodDetails } =
    useFetch<PodDetailResponseType>("");
  const { data: containers, fetchData: fetchContainers } =
    useFetch<ContainerInfoType[]>("container_info");
  const [selectedTab, setSelectedTab] = useState(POD_TABS[0].value);
  const [selectedPod, setSelectedPod] = useState<null | string>(null);
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const { trace } = router.query;
  useEffect(() => {
    if (trace && selectedCluster) {
      const endpoint = GET_PODS_ENDPOINT.replace(
        "{trace_id}",
        trace as string
      ).replace("{cluster_id}", selectedCluster);
      fetchPods(endpoint);
    }
  }, [trace, selectedCluster]);

  useEffect(() => {
    if (pods && pods.length) {
      setSelectedPod(pods[0].pod);
    }
  }, [pods]);

  useEffect(() => {
    if (selectedPod && trace && pods && selectedCluster) {
      const pod = pods.find((p) => p.pod === selectedPod);
      if (!pod) return;
      const endpoint1 = GET_POD_METRICS_ENDPOINT.replace("{pod-id}", pod.pod)
        .replace("{cluster_id}", selectedCluster)
        .replace("{namespace}", pod.namespace);
      const endpoint2 = GET_POD_CONTAINERS_ENDPOINT.replace("{pod_id}", pod.pod)
        .replace("{cluster_id}", selectedCluster)
        .replace("{namespace}", pod.namespace);
      fetchPodDetails(endpoint1);
      fetchContainers(endpoint2);
    }
  }, [selectedPod, selectedCluster]);

  const renderTabContent = () => {
    if (!pods?.length || !podDetails) return <CustomSkeleton len={8} />;
    const pod = pods.find((p) => p.pod === selectedPod);
    if (!pod || !containers) return <CustomSkeleton len={8} />;
    switch (selectedTab) {
      case POD_METADATA:
        return <PodMetadata pod={pod} />;
      case POD_METRICS:
        return (
          <div className={styles["metrics-container"]}>
            <PodChart pod={podDetails} dataKey="cpu_usage" />
            <PodChart pod={podDetails} dataKey="mem_usage" />
          </div>
        );
      case POD_CONTAINERS:
        return <ContainerMetadata containers={containers} />;
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h6>Pods</h6>
        <Select
          value={selectedPod}
          size="small"
          className={styles.select}
          onChange={(e) => {
            if (e.target && e.target.value) {
              setSelectedPod(e.target.value);
            }
          }}
        >
          {pods &&
            pods.map((p) => {
              return (
                <MenuItem value={p.pod} key={nanoid()}>
                  {p.pod}
                </MenuItem>
              );
            })}
        </Select>
      </div>
      <div className={styles.content}>
        <div className={styles.tabs}>
          <Tabs
            value={selectedTab}
            onChange={(e, value) => {
              setSelectedTab(value);
            }}
          >
            {POD_TABS.map((tab) => {
              return (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              );
            })}
          </Tabs>
        </div>

        <div className={styles["tab-content"]}>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default PodDetailsCard;
