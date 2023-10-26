import { Drawer } from "@mui/material";
import { ICON_BASE_PATH, ICONS } from "utils/images";
import { DRAWER_DEFAULT_WIDTH } from "utils/styles/constants";

import styles from "./DrawerX.module.scss";

interface DrawerXProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  open: boolean;
}

const DrawerX = ({
  onClose,
  title,
  children,
  open,
  width = DRAWER_DEFAULT_WIDTH,
}: DrawerXProps) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      className={styles.drawer}
      anchor="right"
      PaperProps={{
        style: {
          width,
        },
      }}
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
