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
import cx from "classnames";
import styles from "./IncidentDetailMap.module.scss";
import { ICONS, ICON_BASE_PATH } from "utils/images";
import { IGNORED_SERVICES_PREFIXES } from "utils/constants";
import { getNamespace } from "utils/functions";

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
      !IGNORED_SERVICES_PREFIXES.includes(getNamespace(span.source)) &&
      !IGNORED_SERVICES_PREFIXES.includes(getNamespace(span.destination)) &&
      !getNamespace(span.source).includes("zk-client") &&
      !getNamespace(span.destination).includes("zk-client")
    ) {
      edges.push({
        id: `e-${span.source}-${span.destination}`,
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

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const isHorizontal = true;
  dagreGraph.setGraph({ rankdir: "LR" });
  const leftPadding = 80;
  const topPadding = 100;
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node, idx) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2 + leftPadding,
      y: nodeWithPosition.y - nodeHeight / 2 + topPadding,
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
      <button
        onClick={() => toggleSize()}
        className={cx(!isMinimized && styles["active"])}
      >
        <span className={styles["map-btn-icon-container"]}>
          <img
            src={
              !isMinimized
                ? `${ICON_BASE_PATH}/${ICONS["expand-map"]}`
                : `${ICON_BASE_PATH}/${ICONS["collapse-map"]}`
            }
            alt="expand/collapse map"
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
