import { type HTTP_METHODS } from "utils/constants";

import styles from "./SpanEntryPoint.module.scss";

interface SpanEntryPointProps {
  action: (typeof HTTP_METHODS)[number];
}

const SpanEntryPoint = ({ action }: SpanEntryPointProps) => {
  const getAction = () => {
    switch (action) {
      case "DELETE":
        return <span className={styles["action-delete"]}>DELETE</span>;
      default:
        return <span className={styles["action-default"]}>{action}</span>;
    }
  };

  return <span className={styles.container}>{getAction()}</span>;
};

export default SpanEntryPoint;
