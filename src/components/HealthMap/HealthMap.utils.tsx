import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import cx from "classnames";
import { nanoid } from "nanoid";
import { type Edge, MarkerType, type Node, Position } from "reactflow";
import cssVars from "styles/variables.module.scss";
import {
  convertNanoToMilliSeconds,
  getFormattedServiceName,
  getNamespace,
} from "utils/functions";
import { type ServiceMapDetail } from "utils/health/types";
import { type GenericObject } from "utils/types";

import styles from "./HealthMap.module.scss";

export const HEALTHMAP_EDGETYPES = {
  smart: SmartBezierEdge,
};

export const getNodesFromServiceMap = (serviceMap: ServiceMapDetail[]) => {
  const nodes: Node[] = [];
  const memo: GenericObject = {};
  serviceMap.forEach((service) => {
    const reqname =
      service.requestor_service ||
      service.requestor_pod ||
      service.requestor_ip;
    const resname =
      service.responder_service ||
      service.responder_pod ||
      service.responder_ip;

    const isCallingItself = reqname === resname;
    if (!memo[reqname]) {
      nodes.push({
        id: reqname,
        data: { label: reqname, ...service, isCallingItself },
        position: { x: 0, y: 0 },
      });
      memo[reqname] = true;
    }

    if (!memo[resname]) {
      nodes.push({
        id: resname,
        data: { label: resname, ...service, isCallingItself },
        position: { x: 0, y: 0 },
      });
      memo[resname] = true;
    }
  });

  return nodes;
};

export const getEdgesFromServiceMap = (serviceMap: ServiceMapDetail[]) => {
  const edges: Edge[] = [];
  serviceMap.forEach((service) => {
    edges.push({
      id: `${service.requestor_service}-${
        service.responder_service
      }-${nanoid()}`,
      source: service.requestor_service,
      target: service.responder_service,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: cssVars.grey600,
      },
      // @TODO - add types for this
      type: "smart",
    });
  });
  return edges;
};

export const ServiceMapCard = ({ service }: { service: ServiceMapDetail }) => {
  const namespace = getNamespace(service.requestor_service);
  const formattedServiceName = getFormattedServiceName(
    service.requestor_service
  );
  const ITEMS = [
    {
      label: "Req./s",
      value: service.request_throughput,
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
