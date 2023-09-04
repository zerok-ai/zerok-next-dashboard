import { MenuItem, Select, Tab, Tabs } from "@mui/material";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { type PodDetailResponseType } from "utils/pods/types";

import styles from "./PodDetailsCard.module.scss";
import {
  CPU_USAGE,
  MEMORY_USAGE,
  POD_METADATA,
  POD_TABS,
  PodChart,
  PodMetadata,
} from "./PodDetailsCard.utils";

const PodDetailsCard = () => {
  const { data: pods, fetchData: fetchPods } =
    useFetch<PodDetailResponseType[]>("pods");
  const { selectedCluster } = useSelector(clusterSelector);
  console.log({ selectedCluster });
  const [selectedTab, setSelectedTab] = useState(POD_TABS[0].value);
  useEffect(() => {
    fetchPods(`/pods.json`);
  }, []);
  useEffect(() => {
    if (pods && pods.length) {
      setSelectedPod(pods[0].podName);
    }
  }, [pods]);
  const [selectedPod, setSelectedPod] = useState<null | string>(null);
  const renderTabContent = () => {
    if (!pods?.length) return null;
    const pod = pods.find((p) => p.podName === selectedPod);
    switch (selectedTab) {
      case POD_METADATA:
        return <PodMetadata pod={pod!} />;
      case CPU_USAGE:
        return <PodChart pod={pod!} dataKey="cpuUsage" />;
      case MEMORY_USAGE:
        return <PodChart pod={pod!} dataKey="cpuUsage" />;
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h6>Pods</h6>
        <Select value={selectedPod} size="small" className={styles.select}>
          {pods &&
            pods.map((p) => {
              return (
                <MenuItem value={p.podName} key={nanoid()}>
                  {p.podName}
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
