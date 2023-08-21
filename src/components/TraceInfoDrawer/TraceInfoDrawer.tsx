import { Drawer } from "@mui/material";
import TraceInfoTabs from "components/TraceInfoTabs";
import cssVars from "styles/variables.module.scss";
import { type SpanResponse } from "utils/types";

import styles from "./TraceInfoDrawer.module.scss";

interface TraceInfoDrawerProps {
  selectedSpan: string;
  onClose: () => void;
  anchorContainer: string;
  allSpans: SpanResponse;
}

const TraceInfoDrawer = ({
  selectedSpan,
  onClose,
  anchorContainer,
  allSpans,
}: TraceInfoDrawerProps) => {
  return (
    <div className={styles.container}>
      <Drawer
        open={!!selectedSpan}
        onClose={onClose}
        anchor="right"
        variant="permanent"
        hideBackdrop
        PaperProps={{
          style: {
            position: "absolute",
            width: "840px",
            background: cssVars.grey925,
          },
        }}
        className={styles.drawer}
        ModalProps={{
          container: document.getElementById(anchorContainer),
          style: { position: "absolute" },
        }}
        transitionDuration={0}
      >
        <TraceInfoTabs selectedSpan={selectedSpan} allSpans={allSpans} />
      </Drawer>
    </div>
  );
};

export default TraceInfoDrawer;
