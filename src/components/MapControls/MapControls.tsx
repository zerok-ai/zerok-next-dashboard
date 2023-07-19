import cx from "classnames";
import { useReactFlow } from "reactflow";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./MapControls.module.scss";

interface MapControlProps {
  showToggle?: boolean;
  isMinimized?: boolean;
  toggleSize?: () => void;
}

const MapControls = ({
  showToggle = true,
  isMinimized,
  toggleSize,
}: MapControlProps) => {
  const reactFlow = useReactFlow();
  const { zoomIn, zoomOut, fitView } = reactFlow;
  return (
    <div className={styles["map-controls"]}>
      {showToggle && toggleSize && (
        <button
          onClick={() => {
            toggleSize();
          }}
          className={cx(!isMinimized && styles.active)}
        >
          <span className={styles["map-btn-icon-container"]}>
            <img
              src={
                !isMinimized
                  ? `${ICON_BASE_PATH}/${ICONS["expand-map"]}`
                  : `${ICON_BASE_PATH}/${ICONS["collapse-map"]}`
              }
              alt="expand/collapse map"
            />
          </span>
        </button>
      )}
      <button onClick={() => fitView()}>
        <span className={styles["map-btn-icon-container"]}>
          <img src={`${ICON_BASE_PATH}/${ICONS["move-map"]}`} alt="fit map" />
        </span>
      </button>
      <button
        onClick={() => {
          zoomIn();
        }}
      >
        <span className={styles["map-btn-icon-container"]}>
          <img
            src={`${ICON_BASE_PATH}/${ICONS["plus-map"]}`}
            alt="zoom in map"
          />
        </span>
      </button>
      <button
        onClick={() => {
          zoomOut();
        }}
      >
        <span className={styles["map-btn-icon-container"]}>
          <img
            src={`${ICON_BASE_PATH}/${ICONS["minus-map"]}`}
            alt="zoom out map"
          />
        </span>
      </button>
    </div>
  );
};

export default MapControls;
