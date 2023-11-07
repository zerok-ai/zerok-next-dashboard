export interface LoginAPIResponse {
  authToken: {
    UserDetails: {
      email: string;
      first_name: string;
      last_name: string;
      org_id: string;
    };
  };
}

export interface UserProfileType {
  org_id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthType {
  user: null | UserProfileType;
  token: null | string;
  isLoggedIn: boolean;
  loading: boolean;
  error: null | string;
}
