import { useCallback, useMemo, useState } from "react";
import styles from "./HealthMap.module.scss";
import ReactFlow, {
  Background,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { Skeleton } from "@mui/material";

import { getLayoutedElements } from "utils/mapHelpers";
import MapControls from "components/MapControls";
import { ServiceMapDetail } from "utils/health/types";
import {
  HEALTHMAP_EDGETYPES,
  ServiceMapCard,
  getEdgesFromServiceMap,
  getNodesFromServiceMap,
} from "./HealthMap.utils";
import { SPACE_TOKEN } from "utils/constants";

const proOptions = { hideAttribution: true };

interface HealthMapProps {
  serviceMap: ServiceMapDetail[] | null;
}

const HealthMap = ({ serviceMap }: HealthMapProps) => {
  if (!serviceMap || !serviceMap.length) {
    return (
      <Skeleton
        variant="rectangular"
        className={styles["skeleton-container"]}
      />
    );
  }
  const [selectedService, setSelectedService] = useState<null | {
    data: ServiceMapDetail;
    position: { x: number; y: number };
  }>(null);
  const initialNodes = useMemo(() => {
    return getNodesFromServiceMap(serviceMap);
  }, [serviceMap]);

  const initialEdges = useMemo(() => {
    return getEdgesFromServiceMap(serviceMap);
  }, [serviceMap]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges);
  }, [initialNodes, initialEdges]);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  console.log("rerender");
  return (
    <div className={styles["container"]}>
      {selectedService && (
        <div
          className={styles["selected-service"]}
          style={{
            top: selectedService.position.y - SPACE_TOKEN * 10,
            left: selectedService.position.x,
          }}
        >
          <ServiceMapCard service={selectedService.data} />
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        edgeTypes={HEALTHMAP_EDGETYPES}
        onNodeClick={(e, node) => {
          setSelectedService(node);
        }}
        onPaneClick={() => setSelectedService(null)}
        className={styles["react-flow"]}
      >
        <MapControls showToggle={false} />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default HealthMap;
