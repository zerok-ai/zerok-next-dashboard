import cx from "classnames";
import IncidentDetailMap from "components/IncidentDetailMap";
import IncidentInfoTabs from "components/IncidentInfoTabs";
import SpanCard from "components/SpanCard";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { drawerSelector, minimizeDrawer } from "redux/drawer";
import { useDispatch, useSelector } from "redux/store";
import { type SpanResponse } from "utils/types";

import styles from "./IncidentDetailTab.module.scss";
import { SpanDetailDrawer, SpanDrawerButton } from "./IncidentDetailTab.utils";

interface IncidentDetailTabProps {
  spanData: SpanResponse | null;
  selectedSpan: string | null;
  onSpanChange: (spanId: string) => void;
}

const IncidentDetailTab = ({
  spanData,
  selectedSpan,
  onSpanChange,
}: IncidentDetailTabProps) => {
  const dispatch = useDispatch();
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const [isMapMinimized, setIsMapMinimized] = useState(true);
  const toggleMapMinimized = () => {
    setIsMapMinimized(!isMapMinimized);
  };

  const [isSpanDrawerOpen, setIsSpanDrawerOpen] = useState(false);
  const toggleSpanDrawer = () => {
    setIsSpanDrawerOpen(!isSpanDrawerOpen);
  };
  // Minimize main drawer when span drawer is open
  useEffect(() => {
    if (isSpanDrawerOpen && !isDrawerMinimized) {
      dispatch(minimizeDrawer());
    }
  }, [isSpanDrawerOpen]);
  const renderSpans = () => {
    if (spanData == null) return null;
    return Object.keys(spanData).map((key) => {
      const span = spanData[key];
      const active = span.span_id === selectedSpan;
      if (span.destination.includes("zk-client")) {
        return null;
      }
      return (
        <div className={styles["span-tree-container"]} key={nanoid()}>
          <SpanCard
            span={span}
            active={active}
            onClick={(selectedSpan) => {
              onSpanChange(selectedSpan.span_id as string);
            }}
          />{" "}
        </div>
      );
    });
  };

  const handleNodeClick = (
    nodeId: string,
    source?: string,
    destination?: string
  ) => {
    if (!spanData) return;
    const old = selectedSpan as string;
    if (!source && !destination) {
      const span = Object.keys(spanData).find((key) => {
        if (key !== selectedSpan) {
          const span = spanData[key];
          return span.source === nodeId;
        }
        return false;
      });
      onSpanChange(span ?? old);
    } else if (!destination) {
      const span = Object.keys(spanData).find(
        (key) => spanData[key].source === source
      );
      onSpanChange(span ?? old);
    } else if (source && destination) {
      const span = Object.keys(spanData).find(
        (key) =>
          spanData[key].source === source &&
          spanData[key].destination === destination
      );
      onSpanChange(span ?? old);
    }
  };
  return (
    <div
      className={cx(
        styles.container,
        !isMapMinimized && styles["max-map-container"]
      )}
    >
      <div className={styles["map-container"]} id="map-drawer-container">
        {/* Toggle button for drawer */}
        <SpanDrawerButton
          isOpen={isSpanDrawerOpen}
          toggleDrawer={toggleSpanDrawer}
        />
        {/* Drawer for spans */}
        {spanData && (
          <SpanDetailDrawer isOpen={isSpanDrawerOpen}>
            <div className={styles["span-tree-container"]}>{renderSpans()}</div>
          </SpanDetailDrawer>
        )}
        <ReactFlowProvider>
          <IncidentDetailMap
            isMinimized={isMapMinimized}
            toggleSize={toggleMapMinimized}
            spanData={spanData}
            onNodeClick={handleNodeClick}
          />
        </ReactFlowProvider>
      </div>

      <div className={styles["incident-info-container"]}>
        <IncidentInfoTabs selectedSpan={selectedSpan} spanData={spanData} />
      </div>
    </div>
  );
};

export default IncidentDetailTab;
