import { Skeleton } from "@mui/material";
import MapControls from "components/MapControls";
import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { SPACE_TOKEN } from "utils/constants";
import { type ServiceMapDetail } from "utils/health/types";
import { getLayoutedElements } from "utils/mapHelpers";

import styles from "./HealthMap.module.scss";
import {
  getEdgesFromServiceMap,
  getNodesFromServiceMap,
  HEALTHMAP_EDGETYPES,
  ServiceMapCard,
} from "./HealthMap.utils";

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
    (params: any) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );
  return (
    <div className={styles.container}>
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
        onPaneClick={() => {
          setSelectedService(null);
        }}
        className={styles["react-flow"]}
      >
        <MapControls showToggle={false} />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default HealthMap;
