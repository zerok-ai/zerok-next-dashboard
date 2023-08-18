import dagre from "dagre";
import { type Edge, type Node, Position } from "reactflow";

import { NODE_WIDTH } from "./constants";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = NODE_WIDTH;
const nodeHeight = 41;

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[]; edges: Edge[] } => {
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
