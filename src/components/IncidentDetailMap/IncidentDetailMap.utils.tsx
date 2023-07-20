import { nanoid } from "nanoid";
import { type Edge, MarkerType, type Node, Position } from "reactflow";
import cssVars from "styles/variables.module.scss";
import { IGNORED_SERVICES_PREFIXES } from "utils/constants";
import { getNamespace } from "utils/functions";
import {
  type GenericObject,
  type SpanDetail,
  type SpanResponse,
} from "utils/types";
const getNodeFromSpan = (id: string, span: SpanDetail): Node => {
  const exception = span.exception ? { type: "exception" } : {};
  return {
    id,
    data: { label: id, ...span },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    ...exception,
  };
};

export const getNodesFromSpanTree = (spans: SpanResponse) => {
  const nodes: Node[] = [];
  const dict: GenericObject = {};
  Object.keys(spans).map((key) => {
    const span = spans[key];
    const { source, destination } = span;
    if (
      !dict[source] &&
      !IGNORED_SERVICES_PREFIXES.includes(getNamespace(source)) &&
      !source.includes("zk-client") &&
      source
    ) {
      nodes.push(getNodeFromSpan(source, span));
      dict[source] = true;
    }
    if (
      !dict[destination] &&
      !IGNORED_SERVICES_PREFIXES.includes(getNamespace(destination)) &&
      !destination.includes("zk-client") &&
      destination
    ) {
      nodes.push(getNodeFromSpan(destination, span));
      dict[destination] = true;
    }
    return true;
  });
  return nodes;
};

export const getEdgesFromSpanTree = (spanData: SpanResponse) => {
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
      });
    }
    return null;
  });
  return edges;
};
