import { Skeleton, Tab, Tabs, Tooltip } from "@mui/material";
import CustomSkeleton from "components/CustomSkeleton";
import TabSkeletons from "components/helpers/TabSkeletons";
import TimeSelector from "components/TimeSelector";
import TimeSeriesChart from "components/TimeSeriesChart";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { getFormattedTime, getRelativeTime } from "utils/dateHelpers";
import {
  getFormattedServiceName,
  getNamespace,
  trimString,
} from "utils/functions";
import {
  GET_POD_DETAILS_ENDPOINT,
  GET_SERVICE_PODS_ENDPOINT,
} from "utils/services/endpoints";
import { type GenericObject, type PodDetail } from "utils/types";

import styles from "./PodCard.module.scss";
import { transformTimeSeries } from "./PodCard.utils";

interface PodCardProps {
  services: string[] | null;
}

const PodCard = ({ services }: PodCardProps) => {
  const [selectedTab, setSelectedTab] = useState<string | false>(false);
  const {
    data: podList,
    fetchData: fetchPodList,
    setData: setPodList,
  } = useFetch<PodDetail[]>("results", null);
  const {
    data: podStats,
    fetchData: fetchPodStats,
    setData: setPodStats,
  } = useFetch<GenericObject>("", null, transformTimeSeries);
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const range = router.query.range ?? DEFAULT_TIME_RANGE;
  useEffect(() => {
    if (services) {
      setSelectedTab(services[0]);
    }
  }, [services]);

  const filterPods = (pods: PodDetail[]) => {
    const pod = pods.filter((pod) => {
      return pod.status.phase === "Running";
    });
    return pod.length ? pod[0] : pods[0];
  };
  const pod = podList ? filterPods(podList) : null;

  useEffect(() => {
    if (selectedTab && selectedCluster) {
      setPodList(null);
      const namespace = getNamespace(selectedTab);
      const service = getFormattedServiceName(selectedTab);
      const endpoint = GET_SERVICE_PODS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{namespace}", namespace)
        .replace("{service_name}", service)
        .replace("{range}", range as string);
      fetchPodList(endpoint);
    }
  }, [selectedTab, selectedCluster, router]);

  useEffect(() => {
    if (pod) {
      setPodStats(null);
      const endpoint = GET_POD_DETAILS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster!
      )
        .replace("{pod_name}", pod.pod.split("/")[1])
        .replace("{range}", range as string)
        .replace("{namespace}", pod.pod.split("/")[0]);
      fetchPodStats(endpoint);
    }
  }, [pod]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h6>Pods</h6>
      </div>
      {!services ? (
        <TabSkeletons />
      ) : (
        <div className={styles["tab-content"]}>
          <div className={styles["tabs-container"]}>
            <Tabs
              value={selectedTab}
              onChange={(e, value) => {
                setSelectedTab(value);
              }}
              className={styles["tab-key"]}
            >
              {services.map((service) => {
                const Label = () => {
                  return (
                    <Tooltip title={service} placement="top">
                      <span>{trimString(service, 20)}</span>
                    </Tooltip>
                  );
                };
                return <Tab key={service} label={<Label />} value={service} />;
              })}
            </Tabs>
          </div>
          <div className={styles["pods-container"]}>
            <div className={styles["time-selector-container"]}>
              <TimeSelector />
            </div>
            {pod ? (
              <div className={styles["pod-rows"]}>
                <div className={styles["pod-row"]}>
                  <p className={styles.key}>Name</p>
                  <p>{pod.pod}</p>
                </div>
                <div className={styles["pod-row"]}>
                  <p>Status:</p>
                  <p>{pod.status.phase}</p>
                </div>
                <div className={styles["pod-row"]}>
                  <p>Containers:</p>
                  <p>{pod.containers}</p>
                </div>
                <div className={styles["pod-row"]}>
                  <p>Start time:</p>
                  <div>
                    <Tooltip
                      title={getFormattedTime(pod.start_time)}
                      placement="top"
                    >
                      <span>{getRelativeTime(pod.start_time)}</span>
                    </Tooltip>
                  </div>
                </div>
                {/* POD STATS */}
                <div className={styles["pod-row"]}>
                  <p>CPU Utilization:</p>
                  <div>
                    {podStats ? (
                      podStats.cpu.time.length ? (
                        <TimeSeriesChart
                          series={podStats?.cpu.data}
                          timeStamps={podStats?.cpu.time}
                        />
                      ) : (
                        <p>No data</p>
                      )
                    ) : (
                      <Skeleton height={40} width="100%" />
                    )}
                  </div>
                </div>

                {/* LATENCY */}
                <div className={styles["pod-row"]}>
                  <p>Latency:</p>
                  <div>
                    {podStats ? (
                      podStats.latency.time.length ? (
                        <TimeSeriesChart
                          series={podStats?.latency.data}
                          timeStamps={podStats?.latency.time}
                        />
                      ) : (
                        <p>No data</p>
                      )
                    ) : (
                      <Skeleton height={40} width="100%" />
                    )}
                  </div>
                </div>

                {/* MEMORY */}
                <div className={styles["pod-row"]}>
                  <p>HTTP Requests:</p>
                  <div>
                    {podStats ? (
                      podStats.http.time.length ? (
                        <TimeSeriesChart
                          series={podStats?.http.data}
                          timeStamps={podStats?.http.time}
                        />
                      ) : (
                        <p>No data</p>
                      )
                    ) : (
                      <Skeleton height={40} width="100%" />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <CustomSkeleton len={5} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PodCard;
