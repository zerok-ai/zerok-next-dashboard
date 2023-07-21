import { Skeleton } from "@mui/material";
import ExceptionNode from "components/ExceptionNode";
import MapControls from "components/MapControls";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { getLayoutedElements } from "utils/mapHelpers";
import { type SpanResponse } from "utils/types";

import styles from "./IncidentDetailMap.module.scss";
import {
  getEdgesFromSpanTree,
  getNodesFromSpanTree,
} from "./IncidentDetailMap.utils";

const proOptions = { hideAttribution: true };

const NodeTypes = {
  exception: ExceptionNode,
};

interface IncidentDetailMapProps {
  isMinimized: boolean;
  toggleSize: () => void;
  spanData: SpanResponse | null;
  onNodeClick: (
    sourceId: string,
    source?: string,
    destination?: string
  ) => void;
}

const IncidentDetailMap = ({
  isMinimized,
  toggleSize,
  spanData,
  onNodeClick,
}: IncidentDetailMapProps) => {
  if (!spanData) {
    return (
      <Skeleton
        variant="rectangular"
        className={styles["skeleton-container"]}
      />
    );
  }
  const router = useRouter();
  const initialNodes = useMemo(
    () => getNodesFromSpanTree(spanData),
    [spanData]
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
    if (layoutedNodes.length > 0) {
      setEdges(layoutedEdges);
      setNodes(layoutedNodes);
    }
  }, [router, layoutedEdges, layoutedNodes]);
  return (
    <div className={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        nodeTypes={NodeTypes}
        onNodeClick={(event, node) => {
          const edge = edges.find((edge) => edge.source === node.id);
          onNodeClick(node.id, edge?.source, edge?.target);
        }}
      >
        <MapControls isMinimized={isMinimized} toggleSize={toggleSize} />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default IncidentDetailMap;
