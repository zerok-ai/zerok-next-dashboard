import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import cx from "classnames";
import { nanoid } from "nanoid";
import { type Edge, MarkerType, type Node } from "reactflow";
import cssVars from "styles/variables.module.scss";
import {
  convertNanoToMilliSeconds,
  getFormattedServiceName,
  getNamespace,
  getNumberFromReqThroughput,
  trimString,
} from "utils/functions";
import { type ServiceMapDetail } from "utils/health/types";
import { type GenericObject } from "utils/types";

import styles from "./HealthMap.module.scss";

export const HEALTHMAP_EDGETYPES = {
  smart: SmartBezierEdge,
};

interface ServiceMapCardProps {
  data: ServiceMapDetail & { label: string };
  position: { x: number; y: number };
}

const getLabelID = (service: ServiceMapDetail) => {
  const reqname =
    service.requestor_service || service.requestor_pod || service.requestor_ip;
  const resname =
    service.responder_service || service.responder_pod || service.responder_ip;
  return { reqname, resname };
};

export const getNodesFromServiceMap = (serviceMap: ServiceMapDetail[]) => {
  const nodes: Node[] = [];
  const memo: GenericObject = {};
  serviceMap.forEach((service) => {
    const { reqname, resname } = getLabelID(service);
    const isCallingItself = reqname === resname;
    if (!memo[reqname]) {
      const type = service.error_rate > 0 ? "exception" : "default";
      nodes.push({
        type,
        id: reqname,
        data: { label: trimString(reqname, 25), ...service, isCallingItself },
        position: { x: 0, y: 0 },
      });
      memo[reqname] = true;
    }

    if (!memo[resname]) {
      const type = service.error_rate > 0 ? "exception" : "default";
      nodes.push({
        id: resname,
        data: { label: trimString(reqname, 25), ...service, isCallingItself },
        position: { x: 0, y: 0 },
        type,
      });
      memo[resname] = true;
    }
  });

  return nodes;
};

export const getEdgesFromServiceMap = (serviceMap: ServiceMapDetail[]) => {
  const edges: Edge[] = [];
  serviceMap.forEach((service) => {
    const { reqname, resname } = getLabelID(service);
    edges.push({
      id: `${reqname}-${service.responder_service}-${resname}`,
      source: reqname,
      target: resname,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: cssVars.grey600,
      },
      type: reqname === resname ? "smart" : "default",
      // @TODO - add types for this
    });
  });
  return edges;
};

export const ServiceMapCard = ({
  selectedService,
}: {
  selectedService: ServiceMapCardProps;
}) => {
  const service = selectedService.data;
  const namespace = getNamespace(service.label);
  const formattedServiceName = getFormattedServiceName(service.label);
  const ITEMS = [
    {
      label: "Req./s",
      value: getNumberFromReqThroughput(service.request_throughput),
    },
    {
      label: "Errors",
      value: service.error_rate,
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
      <div className={styles["service-name-container"]}>
        <p className={styles["service-name"]}>{formattedServiceName}</p>
        <p className={cx("label-medium", styles["service-namespace"])}>
          {namespace}
        </p>
      </div>
      {/* row 1 */}
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
