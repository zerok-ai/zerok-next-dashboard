import { useCallback } from "react";
import styles from "./IncidentDetailMap.module.scss";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { CiMinimize1, CiMaximize1 } from "react-icons/ci";
import { IconButton } from "@mui/material";

import cx from "classnames";

const proOptions = { hideAttribution: true };

interface IncidentDetailMapProps {
  isMinimized: boolean;
  toggleSize: () => void;
}

const IncidentDetailMap = ({
  isMinimized,
  toggleSize,
}: IncidentDetailMapProps) => {
  const initialNodes = [
    { id: "1", position: { x: 100, y: 50 }, data: { label: "1" } },
    { id: "2", position: { x: 150, y: 100 }, data: { label: "2" } },
  ];
  const initialEdges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "red",
      },
    },
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
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
