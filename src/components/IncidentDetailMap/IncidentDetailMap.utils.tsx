import { Edge, MarkerType, Node, Position } from "reactflow";
import { GenericObject, SpanDetail, SpanResponse } from "utils/types";
import cssVars from "styles/variables.module.scss";
import { IGNORED_SERVICES_PREFIXES } from "utils/constants";
import { getNamespace } from "utils/functions";
import { nanoid } from "nanoid";
const getNodeFromSpan = (id: string, span: SpanDetail): Node => {
  let x = 0;
  let y = 0;
  return {
    id,
    data: { label: id, ...span },
    position: { x, y },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };
};

export const getNodesFromSpanTree = (
  span: SpanDetail,
  memo: GenericObject = {},
  nodes: Node[] = []
) => {
  const { source, destination } = span;
  if (
    !memo[source] &&
    !IGNORED_SERVICES_PREFIXES.includes(getNamespace(source)) &&
    !source.includes("zk-client")
  ) {
    memo[source] = true;
    nodes.push(getNodeFromSpan(source, span));
  }
  if (
    !memo[destination] &&
    !IGNORED_SERVICES_PREFIXES.includes(getNamespace(destination)) &&
    !destination.includes("zk-client")
  ) {
    memo[destination] = true;
    nodes.push(getNodeFromSpan(destination, span));
  }
  if (span.children) {
    span.children.forEach((child, idx) => {
      return getNodesFromSpanTree(child, { ...memo }, nodes);
    });
  }
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
      edges.push({
        id: `e-${span.source}-${span.destination}-${nanoid()}`,
        source: span.source,
        target: span.destination,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: cssVars.grey600,
        },
      });
    }
  });
  return edges;
};
