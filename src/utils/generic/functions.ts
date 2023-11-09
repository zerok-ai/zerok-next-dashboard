import { type ClusterType } from "redux/types";

export const isClusterHealthy = (cluster: ClusterType) => {
  const { status } = cluster;
  if (status === "CS_HEALTHY" || status === "CS_DEGRADED") return true;
  return false;
};
