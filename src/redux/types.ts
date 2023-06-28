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
