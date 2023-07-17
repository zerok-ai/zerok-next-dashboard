import { nanoid } from "nanoid";
import { Edge, MarkerType, Node } from "reactflow";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import { ServiceMapDetail } from "utils/health/types";
import { GenericObject } from "utils/types";

import cssVars from "styles/variables.module.scss";

export const HEALTHMAP_EDGETYPES = {
  smart: SmartBezierEdge,
};

export const getNodesFromServiceMap = (serviceMap: ServiceMapDetail[]) => {
  const nodes: Node[] = [];
  const memo: GenericObject = {};
  serviceMap.forEach((service) => {
    if (!memo[service.requestor_service]) {
      nodes.push({
        id: service.requestor_service,
        data: { label: service.requestor_service },
        position: { x: 0, y: 0 },
      });
      memo[service.requestor_service] = true;
    }
    if (!memo[service.responder_service]) {
      nodes.push({
        id: service.responder_service,
        data: { label: service.responder_service },
        position: { x: 0, y: 0 },
      });
      memo[service.responder_service] = true;
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
