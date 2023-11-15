import { Switch } from "@mui/material";

import styles from "./EnableDisableTableAction.module.scss";

interface EnableDisableTableActionProps {
  isEnabled: boolean;
}
const EnableDisableTableAction = ({
  isEnabled,
}: EnableDisableTableActionProps) => {
  return (
    <div className={styles["action-item"]}>
      <span>{isEnabled ? "Disable" : "Enable"}</span>
      <Switch
        size="medium"
        defaultChecked={isEnabled}
        className={styles.switch}
      />
    </div>
  );
};

export default EnableDisableTableAction;
