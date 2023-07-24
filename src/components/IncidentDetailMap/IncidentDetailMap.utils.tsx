import { nanoid } from "nanoid";
import { type Edge, MarkerType, type Node, Position } from "reactflow";
import cssVars from "styles/variables.module.scss";
import { IGNORED_SERVICES_PREFIXES } from "utils/constants";
import { getNamespace, trimString } from "utils/functions";
import {
  type GenericObject,
  type SpanDetail,
  type SpanResponse,
} from "utils/types";
const getNodeFromSpan = (
  id: string,
  span: SpanDetail,
  selectedSpan: SpanDetail
): Node => {
  const getType = () => {
    if (id === selectedSpan.source && !span.exceptionParent) {
      return "selected";
    }
    if (span.exceptionParent) {
      return "exception";
    }
    return "default";
  };
  return {
    id,
    data: { label: trimString(id, 25), ...span },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    type: getType(),
  };
};

export const getNodesFromSpanTree = (
  spans: SpanResponse,
  selectedSpan: string
) => {
  const nodes: Node[] = [];
  const dict: GenericObject = {};
  Object.keys(spans).map((key) => {
    const span = spans[key];
    const { source, destination } = span;
    if (
      !dict[source] &&
      !IGNORED_SERVICES_PREFIXES.includes(getNamespace(source)) &&
      !source.includes("zk-client") &&
      !destination.includes("zk-client") &&
      source
    ) {
      nodes.push(getNodeFromSpan(source, span, spans[selectedSpan]));
      dict[source] = true;
    }
    if (
      !dict[destination] &&
      !source.includes("zk-client") &&
      !IGNORED_SERVICES_PREFIXES.includes(getNamespace(destination)) &&
      !destination.includes("zk-client") &&
      destination
    ) {
      nodes.push(getNodeFromSpan(destination, span, spans[selectedSpan]));
      dict[destination] = true;
    }
    return true;
  });
  return nodes;
};

export const getEdgesFromSpanTree = (
  spanData: SpanResponse,
  selectedSpan: SpanDetail
) => {
  const edges: Edge[] = [];
  Object.keys(spanData).map((key) => {
    const span = spanData[key];
    if (
      span.source &&
      span.destination &&
      !IGNORED_SERVICES_PREFIXES.includes(getNamespace(span.source)) &&
      !IGNORED_SERVICES_PREFIXES.includes(getNamespace(span.destination)) &&
      !getNamespace(span.source).includes("zk-client") &&
      !getNamespace(span.destination).includes("zk-client")
    ) {
      return edges.push({
        id: `e-${span.source}-${span.destination}-${nanoid()}`,
        source: span.source,
        target: span.destination,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: cssVars.grey600,
        },
        animated:
          selectedSpan.destination === span.destination &&
          selectedSpan.source === span.source,
      });
    }
    return null;
  });
  return edges;
};
