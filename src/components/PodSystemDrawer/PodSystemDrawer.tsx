import { useEffect } from "react";
import styles from "./PodSystemDrawer.module.scss";
import { useFetch } from "hooks/useFetch";
import { GET_POD_DETAILS_ENDPOINT } from "utils/endpoints";
import { useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import { GenericObject } from "utils/types";
import { parseTimeseriesData } from "utils/timeSeries";
import { Drawer, Skeleton } from "@mui/material";
import { ICONS, ICON_BASE_PATH } from "utils/images";
import TimeSeriesChart from "components/TimeSeriesChart";

interface PodSystemDrawerProps {
  pod: string | null;
  namespace: string;
  onClose: () => void;
}

const transformTimeSeries = (data: GenericObject) => {
  const timeseries: GenericObject = { cpu: {}, http: {}, latency: {} };

  const cpuData = parseTimeseriesData(data.cpuUsage?.results || []);
  const httpData = parseTimeseriesData(data.errAndReq?.results || []);
  const timeseriesLatencyData = parseTimeseriesData(
    data.latency?.results || []
  );
  timeseries.cpu.data = cpuData.cpu || [];
  timeseries.cpu.time = cpuData.time || [];

  timeseries.http.data = httpData.http || [];
  timeseries.http.time = httpData.time || [];

  timeseries.latency.data = timeseriesLatencyData.latency || [];
  timeseries.latency.time = timeseriesLatencyData.time || [];
  return timeseries;
};

const PodSystemDrawer = ({ pod, onClose, namespace }: PodSystemDrawerProps) => {
  const { data, error, loading, fetchData } = useFetch<GenericObject>(
    ``,
    null,
    transformTimeSeries
  );
  const { selectedCluster } = useSelector(clusterSelector);
  useEffect(() => {
    if (pod && selectedCluster) {
      fetchData(
        GET_POD_DETAILS_ENDPOINT.replace("{cluster_id}", selectedCluster)
          .replace("{namespace}", namespace)
          .replace("{pod_name}", pod)
      );
    }
  }, [pod, selectedCluster]);
  return (
    <Drawer
      open={true}
      onClose={onClose}
      anchor="right"
      className={styles["container"]}
      hideBackdrop
    >
      <div className={styles["header"]}>
        <h6>{pod}</h6>
        <span className={styles["close-btn"]} role="button" onClick={onClose}>
          <img
            src={`${ICON_BASE_PATH}/${ICONS["close-circle"]}`}
            alt="close icon"
          />
        </span>
      </div>
      {loading && (
        <div className={styles["skeletons"]}>
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={100} />
        </div>
      )}
      {data && (
        <div className={styles["charts-container"]}>
          {!!data.cpu.time.length && (
            <div className={styles["chart"]}>
              <h6>CPU Usage</h6>
              <TimeSeriesChart
                series={data.cpu.data}
                timeStamps={data.cpu.time}
              />
            </div>
          )}
          {!!data.http.time.length && (
            <div className={styles["chart"]}>
              <h6>HTTP Requests</h6>
              <TimeSeriesChart
                series={data.http.data}
                timeStamps={data.http.time}
              />
            </div>
          )}
          {!!data.latency.time.length && (
            <div className={styles["chart"]}>
              <h6>Latency</h6>
              <TimeSeriesChart
                series={data.latency.data}
                timeStamps={data.http.time}
              />
            </div>
          )}
          {!data.latency.time.length &&
            !data.http.time.length &&
            !data.cpu.time.length && <h5>No data</h5>}
        </div>
      )}
    </Drawer>
  );
};

export default PodSystemDrawer;
