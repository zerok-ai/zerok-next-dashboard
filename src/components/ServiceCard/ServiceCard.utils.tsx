import { ICONS, ICON_BASE_PATH } from "utils/images";
import styles from "./ServiceCard.module.scss";
type ServiceCardStatus = "healthy" | "error";
export const ServiceCardStatusIcon = ({
  status,
}: {
  status: ServiceCardStatus;
}) => {
  const HealthyStatus = () => {
    return (
      <div className={styles["healthy-status"]}>
        <div className={styles["healthy-status-connected-icon"]}>
          <img src={`${ICON_BASE_PATH}/${ICONS.world}`} alt="connected_icon" />
        </div>
        <span className={styles["healthy-status-green-dot-icon"]}></span>
      </div>
    );
  };

  const ErrorStatus = () => {
    return (
      <div className={styles["error-status"]}>
        <img src={`${ICON_BASE_PATH}/${ICONS.minus}`} alt="error_icon" />
      </div>
    );
  };
  return (
    <div className={styles["status-icon"]}>
      {status === "healthy" ? <HealthyStatus /> : <ErrorStatus / >}
    </div>
  );
};
