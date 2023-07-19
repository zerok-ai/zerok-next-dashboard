import { Skeleton } from "@mui/material";
import MapControls from "components/MapControls";
import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { getLayoutedElements } from "utils/mapHelpers";
import { type SpanDetail, type SpanResponse } from "utils/types";

import styles from "./IncidentDetailMap.module.scss";
import {
  getEdgesFromSpanTree,
  getNodesFromSpanTree,
} from "./IncidentDetailMap.utils";

const proOptions = { hideAttribution: true };

interface IncidentDetailMapProps {
  isMinimized: boolean;
  toggleSize: () => void;
  spanData: SpanResponse | null;
  spanTree: SpanDetail | null;
  onNodeClick: (spanId: string) => void;
}

const IncidentDetailMap = ({
  isMinimized,
  toggleSize,
  spanData,
  spanTree,
  onNodeClick,
}: IncidentDetailMapProps) => {
  if (!spanData || !spanTree) {
    return (
      <Skeleton
        variant="rectangular"
        className={styles["skeleton-container"]}
      />
    );
  }
  const initialNodes = useMemo(
    () => getNodesFromSpanTree(spanTree),
    [spanTree]
  );
  const initialEdges = useMemo(() => {
    return getEdgesFromSpanTree(spanData);
  }, [spanData]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges);
  }, [initialNodes, initialEdges]);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedEdges, layoutedNodes]);
  return (
    <div className={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        onNodeClick={(event, node) => {
          onNodeClick(node.data.span_id);
        }}
      >
        <MapControls isMinimized={isMinimized} toggleSize={toggleSize} />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default IncidentDetailMap;