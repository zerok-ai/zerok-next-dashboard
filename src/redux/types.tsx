export interface DrawerReduxType {
  isDrawerMinimized: boolean;
  activeLink: string | null;
}

export interface ClusterType {
  name: string;
  id: string;
  nickname: string;
  status: "CS_HEALTHY" | "CS_DEGRADED" | "CS_UNHEALTHY" | "CS_UNKNOWN";
}
export interface ClusterReduxType {
  loading: boolean;
  empty: boolean;
  initialized: boolean;
  error: boolean;
  clusters: ClusterType[];
  status: string;
  selectedCluster: null | string;
  isClusterModalOpen: boolean;
}

export interface IncidentIDReduxType {
  incidentList: string[];
  activeIndex: number;
  loading: boolean;
  error: boolean;
}

export interface SnackbarReduxType {
  key?: string;
  type?: "error" | "success" | "info";
  message?: string;
  open: boolean;
}
