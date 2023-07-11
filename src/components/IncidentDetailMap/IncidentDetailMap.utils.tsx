import {
  Edge,
  MarkerType,
  Node,
  Position,
  SmoothStepEdge,
  useReactFlow,
} from "reactflow";
import dagre from "dagre";
import { GenericObject, SpanDetail, SpanResponse } from "utils/types";
import cssVars from "styles/variables.module.scss";

import styles from "./IncidentDetailMap.module.scss";
import { ICONS, ICON_BASE_PATH } from "utils/images";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 41;

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

// export const getNodePositions = (x: number, y: number, length: number) => {
//   const positions = [];
//   let odd = 1;
//   let even = 1;
//   if (length === 1) return { positions: [{ x: x + 200, y }], x: x + 200, y };

//   if (length === 2) {
//     x += 200;
//     return {
//       positions: [
//         { x, y: y + 100 },
//         { x, y: y - 100 },
//       ],
//       x,
//       y,
//     };
//   }

//   for (let i = 0; i < length; i++) {
//     if (i === 0) {
//       positions.push({ x: x + 200 });
//       continue;
//     }
//     if (i % 2 === 0) {
//       positions.push({ x: x + 200, y: y + even * 70 });
//       ++even;
//     } else {
//       positions.push({ x: x + 200, y: y - odd * 70 });
//       ++odd;
//     }
//   }

//   return { positions, x, y };
// };

export const getNodesFromSpanTree = (
  span: SpanDetail,
  memo: GenericObject = {},
  nodes: Node[] = []
) => {
  const { source, destination } = span;
  if (!memo[source]) {
    memo[source] = true;
    nodes.push(getNodeFromSpan(source, span));
  }
  if (!memo[destination]) {
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

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const isHorizontal = true;
  dagreGraph.setGraph({ rankdir: "LR" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const MapControls = ({
  isMinimized,
  toggleSize,
}: {
  isMinimized: boolean;
  toggleSize: () => void;
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <div className={styles["map-controls"]}>
      <button onClick={() => toggleSize()}>
        <span className={styles["map-btn-icon-container"]}>
          <img
            src={`${ICON_BASE_PATH}/${ICONS["expand-map"]}`}
            alt="expand map"
          />
        </span>
      </button>
      <button onClick={() => fitView()}>
        <span className={styles["map-btn-icon-container"]}>
          <img src={`${ICON_BASE_PATH}/${ICONS["move-map"]}`} alt="fit map" />
        </span>
      </button>
      <button onClick={() => zoomIn()}>
        <span className={styles["map-btn-icon-container"]}>
          <img
            src={`${ICON_BASE_PATH}/${ICONS["plus-map"]}`}
            alt="zoom in map"
          />
        </span>
      </button>
      <button onClick={() => zoomOut()}>
        <span className={styles["map-btn-icon-container"]}>
          <img
            src={`${ICON_BASE_PATH}/${ICONS["minus-map"]}`}
            alt="zoom out map"
          />
        </span>
      </button>
    </div>
  );
};
