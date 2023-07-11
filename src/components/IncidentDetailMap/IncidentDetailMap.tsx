import { useCallback, useMemo } from "react";
import styles from "./IncidentDetailMap.module.scss";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { CiMinimize1, CiMaximize1 } from "react-icons/ci";
import { IconButton, Skeleton } from "@mui/material";

import cx from "classnames";
import { SpanDetail, SpanResponse } from "utils/types";
import {
  getEdgesFromSpanTree,
  getLayoutedElements,
  getNodesFromSpanTree,
} from "./IncidentDetailMap.utils";

const proOptions = { hideAttribution: true };

interface IncidentDetailMapProps {
  isMinimized: boolean;
  toggleSize: () => void;
  spanData: SpanResponse | null;
  spanTree: SpanDetail | null;
  onNodeClick: (span: SpanDetail) => void;
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
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  return (
    <div className={styles["container"]}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        onNodeClick={(event, node) => onNodeClick(node.data as SpanDetail)}
      >
        <Controls />
        <Background gap={12} size={1} />
        <IconButton
          onClick={toggleSize}
          className={cx(
            styles["size-btn"],
            !isMinimized && styles["size-btn-active"]
          )}
        >
          {isMinimized ? <CiMaximize1 /> : <CiMinimize1 />}
        </IconButton>
      </ReactFlow>
    </div>
  );
};

export default IncidentDetailMap;
