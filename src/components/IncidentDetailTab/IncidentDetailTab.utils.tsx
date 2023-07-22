import { Drawer, IconButton } from "@mui/material";
import cx from "classnames";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import cssVars from "styles/variables.module.scss";

import styles from "./IncidentDetailTab.module.scss";
export const SpanDrawerButton = ({
  isOpen,
  toggleDrawer,
}: {
  isOpen: boolean;
  toggleDrawer: () => void;
}) => {
  return (
    <IconButton
      size="medium"
      className={cx(styles["drawer-btn"], isOpen && styles["drawer-btn-open"])}
      onClick={toggleDrawer}
    >
      {isOpen ? (
        <AiFillCaretLeft className={styles["drawer-btn-icon"]} />
      ) : (
        <AiFillCaretRight className={styles["drawer-btn-icon"]} />
      )}
    </IconButton>
  );
};

export const SpanDetailDrawer = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Drawer
      open={isOpen}
      anchor="left"
      className={styles.drawer}
      PaperProps={{
        style: {
          position: "absolute",
          width: cssVars.incidentDrawerWidth,
          background: cssVars.backgroundDark,
        },
      }}
      ModalProps={{
        container: document.getElementById("map-drawer-container"),
        style: { position: "absolute" },
      }}
      SlideProps={{
        onExiting: (node) => {
          node.style.webkitTransform = "scaleX(0)";
          node.style.transform = "scaleX(0)";
          node.style.transformOrigin = "top left ";
        },
      }}
      hideBackdrop
    >
      {children}
    </Drawer>
  );
};
