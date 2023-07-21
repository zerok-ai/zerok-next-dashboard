import { Drawer } from "@mui/material";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./DrawerX.module.scss";

interface DrawerXProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const DrawerX = ({ onClose, title, children }: DrawerXProps) => {
  return (
    <Drawer
      open={true}
      onClose={onClose}
      className={styles.drawer}
      anchor="right"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h6>{title}</h6>
          <span className={styles["close-btn"]} onClick={onClose}>
            <img
              src={`${ICON_BASE_PATH}/${ICONS["close-circle"]}`}
              alt="close icon"
            />
          </span>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </Drawer>
  );
};

export default DrawerX;
