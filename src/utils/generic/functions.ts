import { showSnackbar } from "redux/snackbar";
import store from "redux/store";
import { type ClusterType } from "redux/types";

export const isClusterHealthy = (cluster: ClusterType) => {
  const { status } = cluster;
  if (status === "CS_HEALTHY" || status === "CS_DEGRADED") return true;
  return false;
};

export const dispatchSnackbar = (
  type: "info" | "success" | "error",
  message: string
) => {
  store.dispatch(
    showSnackbar({
      type,
      message,
    })
  );
};

export const getSelectedCluster = () => {
  return store.getState().cluster.selectedCluster;
};
