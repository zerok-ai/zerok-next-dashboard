import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import { nanoid } from "nanoid";
import { type Edge, MarkerType, type Node } from "reactflow";
import cssVars from "styles/variables.module.scss";
import { trimString } from "utils/functions";
import { type ServiceMapDetail } from "utils/health/types";
import { type GenericObject } from "utils/types";

export const HEALTHMAP_EDGETYPES = {
  smart: SmartBezierEdge,
};

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
    if (!memo[reqname] && reqname.length > 0) {
      const type = service.error_rate > 0 ? "exception" : "default";
      nodes.push({
        type,
        id: reqname,
        data: {
          label: trimString(reqname, 25),
          ...service,
          isCallingItself,
          fullName: reqname,
        },
        position: { x: 0, y: 0 },
      });
      memo[reqname] = true;
    }

    if (!memo[resname] && resname.length > 0) {
      const type = service.error_rate > 0 ? "exception" : "default";
      nodes.push({
        id: resname,
        data: {
          label: trimString(resname, 25),
          ...service,
          fullName: resname,
          isCallingItself,
        },
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
    if (reqname && resname) {
      edges.push({
        id: `${nanoid()}`,
        source: reqname,
        target: resname,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: cssVars.grey600,
        },
        type: reqname === resname ? "smart" : "default",
        // @TODO - add types for this
      });
    }
  });
  return edges;
};
