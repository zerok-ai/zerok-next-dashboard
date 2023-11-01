import { MenuItem, Modal, Select, Tab, Tabs } from "@mui/material";
import CustomSkeleton from "components/custom/CustomSkeleton";
import ExpandIcon from "components/helpers/ExpandIcon";
import { useFetch } from "hooks/useFetch";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
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

interface PodDetailsCardProps {
  incidentId: string | null;
}

const PodDetailsCard = ({ incidentId }: PodDetailsCardProps) => {
  const {
    data: pods,
    fetchData: fetchPods,
    errorData: podsErrorData,
    error: podsError,
    initialFetchDone: podsInitialFetchDone,
  } = useFetch<PodInfoType[]>("pods_info");
  const {
    data: podDetails,
    fetchData: fetchPodDetails,
    setData: setPodDetails,
  } = useFetch<PodDetailResponseType>("");
  const {
    data: containers,
    fetchData: fetchContainers,
    setData: setContainers,
    initialFetchDone: containersInitialFetchDone,
  } = useFetch<ContainerInfoType[]>("container_info");

  const [selectedTab, setSelectedTab] = useState(POD_TABS[0].value);
  const [selectedPod, setSelectedPod] = useState<string>("");
  const [isExpanded, toggleExpanded] = useToggle(false);

  const { selectedCluster } = useSelector(clusterSelector);
  useEffect(() => {
    if (incidentId && selectedCluster) {
      setPodDetails(null);
      setContainers(null);
      setSelectedPod("");
      const endpoint = GET_PODS_ENDPOINT.replace(
        "{trace_id}",
        incidentId
      ).replace("{cluster_id}", selectedCluster);
      fetchPods(endpoint);
    }
  }, [incidentId, selectedCluster]);

  useEffect(() => {
    if (pods && pods.length) {
      setSelectedPod(pods[0].pod);
    }
  }, [pods]);

  useEffect(() => {
    if (selectedPod && incidentId && pods && selectedCluster) {
      const pod = pods.find((p) => p.pod === selectedPod);
      if (!pod) return;
      const endpoint1 = GET_POD_METRICS_ENDPOINT.replace("{pod_id}", pod.pod)
        .replace("{cluster_id}", selectedCluster)
        .replace("{namespace}", pod.namespace);
      const endpoint = GET_POD_CONTAINERS_ENDPOINT.replace("{pod_id}", pod.pod)
        .replace("{cluster_id}", selectedCluster)
        .replace("{namespace}", pod.namespace);
      setContainers(null);
      setPodDetails(null);
      fetchContainers(endpoint);
      fetchPodDetails(endpoint1);
    }
  }, [selectedPod, selectedCluster]);
  if (podsError) {
    const message = podsErrorData?.response?.data?.error?.info?.error;
    const renderMessage = () => {
      if (message && message.includes("No metric server found")) {
        return (
          <span>
            K8s metrics data is not being sent to the Prometheus instance you
            have integrated ZeroK with. Please{" "}
            <Link href="/integrations/prometheus/list">integrate ZeroK</Link>{" "}
            with the Prometheus instance which contains K8s metrics
          </span>
        );
      } else if (!message) {
        return (
          <span>
            Something went wrong while fetching pod details, please try again
            later or contact support.
          </span>
        );
      } else {
        return (
          <span>
            Please{" "}
            <Link href="/integrations/prometheus/list">
              integrate ZeroK with Prometheus
            </Link>{" "}
            to automatically query pod metrics and events with the Prometheus
            instance which contains K8s metrics
          </span>
        );
      }
    };
    return (
      <div className={styles.container}>
        <div className={styles.header}>Pods</div>
        <div className={styles["error-content"]}>{renderMessage()}</div>
      </div>
    );
  }
  const renderTabContent = () => {
    if (!pods && !podsInitialFetchDone) return <CustomSkeleton len={8} />;
    if ((!pods && podsInitialFetchDone) || (pods && pods.length === 0)) {
      return <div>No pods found.</div>;
    }
    if (pods) {
      const pod = pods.find((p) => p.pod === selectedPod);
      if (!pod) {
        return <div>Invalid pod selected.</div>;
      }
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
          return (
            <ContainerMetadata
              containers={containers}
              initialFetchDone={containersInitialFetchDone}
            />
          );
      }
    }
  };
  const WrapperElement = ({ children }: { children: React.ReactElement }) => {
    return isExpanded ? (
      <Modal
        open={true}
        onClose={toggleExpanded}
        keepMounted={true}
        className={styles.modal}
        hideBackdrop={true}
      >
        <Fragment>
          <div className={styles.backdrop} onClick={toggleExpanded}></div>
          {children}
        </Fragment>
      </Modal>
    ) : (
      <Fragment>{children}</Fragment>
    );
  };
  return (
    <WrapperElement>
      <div className={styles.container}>
        <div className={styles.header}>
          <h6>Pods</h6>
          <div className={styles["header-actions"]}>
            <Select
              value={selectedPod}
              size="small"
              className={styles.select}
              onChange={(e) => {
                if (e.target && e.target.value) {
                  setSelectedPod(e.target.value);
                }
              }}
              displayEmpty={true}
              renderValue={(value) => {
                if ((pods && !pods.length) || (!pods && podsInitialFetchDone)) {
                  return "No pods found";
                } else {
                  const pod = pods?.find((p) => p.pod === value);
                  return pod?.pod;
                }
              }}
            >
              {pods && pods.length > 0 ? (
                pods.map((p) => {
                  return (
                    <MenuItem value={p.pod} key={nanoid()}>
                      {p.pod}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem disabled>No pods.</MenuItem>
              )}
            </Select>
            <ExpandIcon
              isExpanded={isExpanded}
              toggleExpansion={toggleExpanded}
            />
          </div>
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
    </WrapperElement>
  );
};

export default PodDetailsCard;
