export interface LoginAPIResponse {
  userDetails: {
    email: string;
    first_name: string;
    last_name: string;
    org_id: string;
    org_name: string;
  };
}

export interface UserProfileType {
  org_id: string;
  email: string;
  first_name: string;
  last_name: string;
  org_name: string;
}

export interface AuthType {
  user: null | UserProfileType;
  token: null | string;
  isLoggedIn: boolean;
  loading: boolean;
  error: null | string;
}
