import { Skeleton } from "@mui/material";
import ExceptionNode from "components/ExceptionNode";
import MapControls from "components/MapControls";
import SelectedNode from "components/SelectedNode";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  type NodeProps,
  type ReactFlowInstance,
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

interface IncidentDetailMapProps {
  isMinimized: boolean;
  toggleSize: () => void;
  spanData: SpanResponse | null;
  selectedSpan: string;
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
  selectedSpan,
  onNodeClick,
}: IncidentDetailMapProps) => {
  const NodeTypes = useMemo(() => {
    const currentSpan = spanData ? spanData[selectedSpan] : null;
    return {
      exception: (props: NodeProps) => (
        <ExceptionNode {...props} selectedSpan={currentSpan} />
      ),
      selected: SelectedNode,
    };
  }, [spanData, selectedSpan]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

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
    () => getNodesFromSpanTree(spanData, selectedSpan),
    [spanData, selectedSpan]
  );
  const initialEdges = useMemo(() => {
    return getEdgesFromSpanTree(spanData, spanData[selectedSpan]);
  }, [spanData, selectedSpan]);

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
  }, [router, layoutedEdges, layoutedNodes, selectedSpan]);

  useEffect(() => {
    if (reactFlowInstance && nodes.length) {
      setTimeout(() => reactFlowInstance.fitView(), 500);
    }
  }, [reactFlowInstance, nodes]);

  return (
    <div className={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        onInit={(rfi) => {
          setReactFlowInstance(rfi);
        }}
        nodeTypes={NodeTypes}
        onNodeClick={(event, node) => {
          const edge = edges.find((edge) => edge.source === node.id);
          onNodeClick(node.id, edge?.source, edge?.target);
        }}
      >
        <MapControls
          isMinimized={isMinimized}
          toggleSize={() => {
            toggleSize();
          }}
        />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default IncidentDetailMap;
