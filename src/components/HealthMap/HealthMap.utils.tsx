import { nanoid } from "nanoid";
import { Edge, MarkerType, Node, Position } from "reactflow";
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
