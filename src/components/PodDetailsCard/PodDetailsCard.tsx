import { MenuItem, Select, Tab, Tabs } from "@mui/material";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { type PodDetailResponseType, type PodListType } from "utils/pods/types";

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
  const { data: pods, fetchData: fetchPods } = useFetch<PodListType[]>("pods");
  const { data: podDetails, fetchData: fetchPodDetails } =
    useFetch<PodDetailResponseType>("");
  const [selectedTab, setSelectedTab] = useState(POD_TABS[0].value);
  const [selectedPod, setSelectedPod] = useState<null | string>(null);
  useEffect(() => {
    fetchPods(`/pods.json`);
  }, []);
  useEffect(() => {
    if (pods && pods.length) {
      setSelectedPod(pods[0].name);
    }
  }, [pods]);
  useEffect(() => {
    if (selectedPod) {
      fetchPodDetails(`/pod_info.json`);
    }
  }, [selectedPod]);

  const renderTabContent = () => {
    if (!pods?.length || !podDetails) return null;
    switch (selectedTab) {
      case POD_METADATA:
        return <PodMetadata pod={podDetails.pod_info} />;
      case CPU_USAGE:
        return <PodChart pod={podDetails} dataKey="cpu_usage" />;
      case MEMORY_USAGE:
        return <PodChart pod={podDetails} dataKey="mem_usage" />;
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
                <MenuItem value={p.name} key={nanoid()}>
                  {p.name}
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
