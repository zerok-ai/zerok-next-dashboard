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
      <section className={styles.container}>
        <header className={styles.header}>
          <h6>{title}</h6>
          <figure
            className={styles["close-btn"]}
            onClick={onClose}
            role="button"
          >
            <img
              src={`${ICON_BASE_PATH}/${ICONS["close-circle"]}`}
              alt="close icon"
            />
          </figure>
        </header>
        <div className={styles.content}>{children}</div>
      </section>
    </Drawer>
  );
};

export default DrawerX;
