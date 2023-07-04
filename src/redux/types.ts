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
  error: boolean;
  clusters: ClusterType[];
  selectedCluster: null | string;
}

export interface ApiKeyType {
  id: string;
  key: string;
  createdAtMs: number;
}

export interface ApiKeyReduxType {
  loading: boolean;
  error: boolean;
  apiKeys: ApiKeyType[];
}
