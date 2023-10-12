import cx from "classnames";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import {
  convertNanoToMilliSeconds,
  getFormattedServiceName,
  getNamespace,
  getNumberFromReqThroughput,
} from "utils/functions";
import { type ServiceMapDetail } from "utils/health/types";

import styles from "./ServiceMapCard.module.scss";

interface ServiceMapCardProps {
  data: ServiceMapDetail & { fullName: string };
  position: { x: number; y: number };
}
export const ServiceMapCard = ({
  selectedService,
}: {
  selectedService: ServiceMapCardProps;
}) => {
  const service = selectedService.data;
  const namespace = getNamespace(service.fullName);
  const router = useRouter();
  const formattedServiceName = getFormattedServiceName(service.fullName);
  const routeToIssues = () => {
    if (!namespace || !formattedServiceName) {
      router.push(`/issues`);
      return;
    }
    const service = namespace + "/" + formattedServiceName;
    router.push(`/issues?services=${encodeURIComponent(service)}`);
  };
  const ITEMS = [
    {
      label: "Req./s",
      value: getNumberFromReqThroughput(service.request_throughput),
    },
    {
      label: "Errors",
      value: Math.ceil(service.error_rate),
    },
    {
      label: "Avg. Latency",
      value: convertNanoToMilliSeconds(service.latency_p50),
    },
    {
      label: "P50",
      value: convertNanoToMilliSeconds(service.latency_p50),
    },
    {
      label: "P90",
      value: convertNanoToMilliSeconds(service.latency_p90),
    },
    {
      label: "P99",
      value: convertNanoToMilliSeconds(service.latency_p99),
    },
  ];
  return (
    <div className={styles["service-card-container"]}>
      <div
        className={styles["service-name-container"]}
        role="button"
        onClick={routeToIssues}
      >
        <p className={styles["service-name"]}>{formattedServiceName}</p>
        <p className={cx("label-medium", styles["service-namespace"])}>
          {namespace}
        </p>
      </div>
      <div className={styles["service-card-items"]}>
        {ITEMS.map((item) => {
          return (
            <div className={styles["service-card-item"]} key={nanoid()}>
              <p className={styles["service-card-item-label"]}>{item.label}</p>
              <p className={styles["service-card-item-value"]}>{item.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
