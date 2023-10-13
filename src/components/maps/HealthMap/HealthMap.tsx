import { Skeleton } from "@mui/material";
import { ServiceMapCard } from "components/health-page/ServiceMapCard/ServiceMapCard";
import ExceptionNode from "components/maps/ExceptionNode";
import MapControls from "components/maps/MapControls";
import { useRouter } from "next/router";
import { type MouseEvent, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { getFormattedServiceName, getNamespace } from "utils/functions";
import { type ServiceMapDetail } from "utils/health/types";
import { getLayoutedElements } from "utils/mapHelpers";

import styles from "./HealthMap.module.scss";
import {
  getEdgesFromServiceMap,
  getNodesFromServiceMap,
  HEALTHMAP_EDGETYPES,
} from "./HealthMap.utils";

const proOptions = { hideAttribution: true };

interface HealthMapProps {
  serviceMap: ServiceMapDetail[] | null;
}

const NodeTypes = {
  exception: (props: NodeProps) => <ExceptionNode {...props} />,
};

const HealthMap = ({ serviceMap }: HealthMapProps) => {
  if (!serviceMap) {
    return (
      <Skeleton
        variant="rectangular"
        className={styles["skeleton-container"]}
      />
    );
  }
  const [selectedService, setSelectedService] = useState<null | {
    data: ServiceMapDetail & { fullName: string };
    position: { x: number; y: number };
  }>(null);
  const router = useRouter();
  const { namespaces, serviceNames } = router.query;
  const [reactFlow, setReactFlow] = useState<ReactFlowInstance | null>(null);

  let filteredServiceMap = serviceMap;
  // filter out services based on query params
  if (namespaces) {
    filteredServiceMap = filteredServiceMap.filter((service) => {
      return (
        namespaces.includes(getNamespace(service.requestor_service)) ||
        namespaces.includes(getNamespace(service.responder_service))
      );
    });
  }

  if (serviceNames) {
    filteredServiceMap = filteredServiceMap.filter((service) => {
      return (
        serviceNames.includes(
          getFormattedServiceName(service.requestor_service)
        ) ||
        serviceNames.includes(
          getFormattedServiceName(service.responder_service)
        )
      );
    });
  }

  const initialNodes = useMemo(() => {
    return getNodesFromServiceMap(filteredServiceMap);
  }, [filteredServiceMap, router]);

  const initialEdges = useMemo(() => {
    return getEdgesFromServiceMap(filteredServiceMap);
  }, [filteredServiceMap, router]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    if (!initialNodes || !initialEdges) {
      return { nodes: [], edges: [] };
    } else {
      return getLayoutedElements(initialNodes, initialEdges);
    }
  }, [initialNodes, initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setEdges(layoutedEdges);
    setNodes(layoutedNodes);
  }, [router]);

  useEffect(() => {
    if (reactFlow) {
      setTimeout(() => reactFlow.fitView(), 100);
    }
  }, [reactFlow, router]);

  const onNodeClick = (e: MouseEvent, node: Node) => {
    const target = e.target as HTMLElement;
    const pos = target.getBoundingClientRect();
    console.log({ pos });
    setSelectedService({
      ...node,
      position: {
        x: pos.left,
        y: pos.top,
      },
    });
  };

  return (
    <div className={styles.container}>
      {selectedService && (
        <div
          className={styles["selected-service"]}
          style={{
            top: selectedService.position.y,
            left: selectedService.position.x,
          }}
        >
          <ServiceMapCard selectedService={selectedService} />
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        proOptions={proOptions}
        edgeTypes={HEALTHMAP_EDGETYPES}
        nodeTypes={NodeTypes}
        onInit={(rfi) => {
          setReactFlow(rfi);
        }}
        onNodeClick={onNodeClick}
        onMove={() => {
          setSelectedService(null);
        }}
        onPaneClick={() => {
          setSelectedService(null);
        }}
        className={styles["react-flow"]}
      >
        {reactFlow && (
          <MapControls showToggle={false} reactFlowInstance={reactFlow} />
        )}
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default HealthMap;
