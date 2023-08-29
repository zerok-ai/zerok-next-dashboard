import { IconButton, Tooltip } from "@mui/material";
import TooltipX from "components/themeX/TooltipX";
import { triggerRefetch } from "redux/cluster";
import { useDispatch } from "redux/store";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./ClusterRefreshButton.module.scss";

const ClusterRefreshButton = () => {
  const dispatch = useDispatch();
  return (
    <TooltipX title="Refresh data">
      <IconButton
        className={styles.container}
        size="large"
        onClick={async () => dispatch(triggerRefetch())}
      >
        <img src={`${ICON_BASE_PATH}/${ICONS.refresh}`} alt="refresh" />
      </IconButton>
    </TooltipX>
  );
};

export default ClusterRefreshButton;
