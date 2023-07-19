import { IconButton } from "@mui/material";
import { getClusters } from "redux/cluster";
import { useDispatch } from "redux/store";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./ClusterRefreshButton.module.scss";

const ClusterRefreshButton = () => {
  const dispatch = useDispatch();
  return (
    <IconButton
      className={styles.container}
      size="large"
      onClick={async () => await dispatch(getClusters())}
    >
      <img src={`${ICON_BASE_PATH}/${ICONS.refresh}`} alt="refresh" />
    </IconButton>
  );
};

export default ClusterRefreshButton;
