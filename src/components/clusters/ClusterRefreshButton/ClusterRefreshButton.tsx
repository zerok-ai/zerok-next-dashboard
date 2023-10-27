import { IconButton } from "@mui/material";
import TooltipX from "components/themeX/TooltipX";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./ClusterRefreshButton.module.scss";

interface ClusterRefreshButtonProps {
  onRefresh?: () => void;
}

const ClusterRefreshButton = ({ onRefresh }: ClusterRefreshButtonProps) => {
  return (
    <TooltipX title="Refresh data" arrow={false}>
      <IconButton
        className={styles.container}
        size="large"
        onClick={() => {
          // dispatch(triggerRefetch());
          onRefresh && onRefresh();
        }}
      >
        <img src={`${ICON_BASE_PATH}/${ICONS.refresh}`} alt="refresh" />
      </IconButton>
    </TooltipX>
  );
};

export default ClusterRefreshButton;
