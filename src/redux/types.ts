interface UserProfileType {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthType {
  user: null | UserProfileType;
  token: null | string;
  isLoggedIn: boolean;
  loading: boolean;
  error: null | string;
}

interface DrawerReduxType {
  isDrawerMinimized: boolean;
  activeLink: string | null;
}

interface ClusterType {
  name: string;
  id: string;
  nickname: string;
  status: string;
}
interface ClusterReduxType {
  loading: boolean;
  error: boolean;
  clusters: ClusterType[];
}
