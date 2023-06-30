import { useDispatch } from "redux/store";
import styles from "./ClusterRefreshButton.module.scss";
import { IconButton } from "@mui/material";
import { ICONS, ICON_BASE_PATH } from "utils/images";
import { getClusters } from "redux/cluster";

const ClusterRefreshButton = () => {
  const dispatch = useDispatch();
  return (
    <IconButton
      className={styles["container"]}
      size="large"
      onClick={() => dispatch(getClusters())}
    >
      <img src={`${ICON_BASE_PATH}/${ICONS.refresh}`} alt="refresh" />
    </IconButton>
  );
};

export default ClusterRefreshButton;
