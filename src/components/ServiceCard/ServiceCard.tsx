import { ServiceDetail } from "utils/types";
import styles from "./ServiceCard.module.scss";
import {
  convertNanoToMilliSeconds,
  getFormattedServiceName,
  getNamespace,
} from "utils/functions";

import cx from 'classnames';
import { ServiceCardStatusIcon } from "./ServiceCard.utils";
interface ServiceCardProps {
  service: ServiceDetail;
}
const ServiceCard = ({ service }: ServiceCardProps) => {
  const sname = service.service;
  const namespace = getNamespace(sname);
  const formattedServiceName = getFormattedServiceName(sname);
  const isHealthy = service.http_error_rate_in === 0;
  // console.log({
  //   sname,
  //   namespace: namespace,
  //   formattedServiceName: formattedServiceName,
  // });
  return (
    <div className={styles["container"]}>

      <ServiceCardStatusIcon status={isHealthy ? "healthy" : "error"} /> 

      <div className={styles["service-name-container"]}>
        <p className={styles["service-name"]}>{formattedServiceName}</p>
        <p className={cx("label-medium", styles['service-namespace'])}>{namespace}</p>
      </div>

      <div className={styles["stat-container"]}>
        <div className={styles["stat-item"]}>
          <span className={cx("label-small",styles['item-label'])}>Req/s</span>
          <p>{service.http_req_throughput_in}</p>
        </div>
        <div className={styles["stat-item"]}>
          <span className={cx("label-small",styles['item-label'])}>Errors</span>
          <p>{service.http_error_rate_in || "0"}</p>
        </div>
        <div className={styles["stat-item"]}>
          <span className={cx("label-small",styles['item-label'])}>Average latency</span>
          <p>
            {convertNanoToMilliSeconds(service.http_latency_in.p50) || "NA ms"}
          </p>
        </div>
      </div>

      {/* percentile container */}
      <div className={styles["percentile-container"]}>
        <div className={styles["stat-item"]}>
          <span className={cx("label-small",styles['item-label'])}>P75</span>
          <p>{convertNanoToMilliSeconds(service.http_latency_in.p75)}</p>
        </div>
        <div className={styles["stat-item"]}>
          <span className={cx("label-small",styles['item-label'])}>P90</span>
          <p>{convertNanoToMilliSeconds(service.http_latency_in.p90)}</p>
        </div>
        {/* <div className={styles["stat-item"]}>
          <span className={cx("label-small",styles['item-label'])}>P99</span>
          <p>{convertNanoToMilliSeconds(service.http_latency_in.p90)}</p>
        </div> */}
      </div>
    </div>
  );
};

export default ServiceCard;
