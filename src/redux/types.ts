export interface UserProfileType {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthType {
  user: null | UserProfileType;
  token: null | string;
  isLoggedIn: boolean;
  loading: boolean;
  error: null | string;
}

export interface DrawerReduxType {
  isDrawerMinimized: boolean;
  activeLink: string | null;
}

export interface ClusterType {
  name: string;
  id: string;
  nickname: string;
  status: string;
}
export interface ClusterReduxType {
  loading: boolean;
  empty: boolean;
  error: boolean;
  clusters: ClusterType[];
  status: string;
  selectedCluster: null | string;
  renderTrigger: string;
}

export interface IncidentIDReduxType {
  incidentList: string[];
  activeIndex: number;
  loading: boolean;
  error: boolean;
}
