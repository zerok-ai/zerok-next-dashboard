import { Edge, MarkerType, Node, Position } from "reactflow";
import { GenericObject, SpanDetail, SpanResponse } from "utils/types";
import cssVars from "styles/variables.module.scss";

const getNodeFromSpan = (id: string, x: number, y: number): Node => {
  return {
    id,
    data: { label: id },
    position: { x, y },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };
};

export const getNodePositions = (x: number, y: number, length: number) => {
  const positions = [];
  let odd = 1;
  let even = 1;
  if (length === 1) return { positions: [{ x: x + 200, y }], x: x + 200, y };

  if (length === 2) {
    x += 200;
    return {
      positions: [
        { x, y: y + 100 },
        { x, y: y - 100 },
      ],
      x,
      y,
    };
  }

  for (let i = 0; i < length; i++) {
    if (i === 0) {
      positions.push({ x: x + 200 });
      continue;
    }
    if (i % 2 === 0) {
      positions.push({ x: x + 200, y: y + even * 70 });
      ++even;
    } else {
      positions.push({ x: x + 200, y: y - odd * 70 });
      ++odd;
    }
  }

  return { positions, x, y };
};

export const getNodesFromSpanTree = (
  span: SpanDetail,
  x: number = 25,
  y: number = 160,
  memo: GenericObject = {},
  nodes: Node[] = [],
  yGap: number = 140
) => {
  const edges: Edge[] = [];
  const { source, destination } = span;
  if (!memo[source]) {
    memo[source] = true;
    nodes.push(getNodeFromSpan(source, x, y));
    x += 200;
  }
  if (!memo[destination]) {
    memo[destination] = true;
    nodes.push(getNodeFromSpan(destination, x, y));
  }
  if (span.children) {
    const {
      positions,
      x: newX,
      y: newY,
    } = getNodePositions(x, y, span.children.length);

    span.children.forEach((child, idx) => {
      return getNodesFromSpanTree(
        child,
        positions[idx].x,
        positions[idx].y,
        { ...memo },
        nodes,
        yGap - 30
      );
    });
  }
  return nodes;
};

export const getEdgesFromSpanTree = (spanData: SpanResponse) => {
  const edges: Edge[] = [];
  Object.keys(spanData).map((key) => {
    const span = spanData[key];
    edges.push({
      id: `e-${span.source}-${span.destination}`,
      source: span.source,
      target: span.destination,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: cssVars.grey600,
      },
    });
  });
  return edges;
};
