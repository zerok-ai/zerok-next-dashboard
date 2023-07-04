import { ServiceDetail } from "utils/types";
import styles from "./ServiceCard.module.scss";
import {
  convertNanoToMilliSeconds,
  getFormattedServiceName,
  getNamespace,
} from "utils/functions";
interface ServiceCardProps {
  service: ServiceDetail;
}
const ServiceCard = ({ service }: ServiceCardProps) => {
  const sname = service.service;
  const namespace = getNamespace(sname);
  const formattedServiceName = getFormattedServiceName(sname);
  // console.log({
  //   sname,
  //   namespace: namespace,
  //   formattedServiceName: formattedServiceName,
  // });
  return (
    <div className={styles["container"]}>
      <div className={styles["service-name-container"]}>
        <p className={styles["namespace"]}>{namespace}/ </p>
        <p className={styles["service-name"]}>{formattedServiceName}</p>
      </div>

      <div className={styles["stat-container"]}>
        <div className={styles["stat-item"]}>
          <label>Req/s</label>
          <p>{convertNanoToMilliSeconds(service.http_req_throughput_in)}</p>
        </div>
        <div className={styles["stat-item"]}>
          <label>Errors</label>
          <p>{service.http_error_rate_in || "0"}</p>
        </div>
        <div className={styles["stat-item"]}>
          <label>Average latency</label>
          <p>
            {convertNanoToMilliSeconds(service.http_latency_in.p50) || "NA ms"}
          </p>
        </div>
      </div>

      {/* percentile container */}
      <div className={styles["percentile-container"]}>
        <div className={styles["stat-item"]}>
          <label>P75</label>
          <p>{convertNanoToMilliSeconds(service.http_latency_in.p75)}</p>
        </div>
        <div className={styles["stat-item"]}>
          <label>P95</label>
          <p>{convertNanoToMilliSeconds(service.http_latency_in.p90)}</p>
        </div>
        <div className={styles["stat-item"]}>
          <label>P99</label>
          <p>{convertNanoToMilliSeconds(service.http_latency_in.p90)}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
