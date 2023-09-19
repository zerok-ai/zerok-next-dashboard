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

export interface SnackbarReduxType {
  key?: string;
  type?: "error" | "success" | "info";
  message?: string;
  open: boolean;
}

export type ChatQueryType =
  | {
      type: "query";
      query: string;
      id: string;
      response: string | null;
      typing: boolean;
      incidentId: string | null;
      issueId: string | null;
    }
  | {
      type: "infer";
      id: string;
      response: null | string;
      typing: boolean;
      incidentId: string | null;
      issueId: string | null;
    };

export interface ChatContextEventType {
  type: "context";
  oldIncidentID: string;
  newIncidentID: string;
  id: string;
}

export interface ChatLikelyCauseType {
  type: "infer";
  response: {
    summary: string | null;
    data: string;
    anamolies: string | null;
  };
  incidentId: string;
  issueId: string;
  typing: boolean;
  id: string;
}

export interface ChatInvalidCardType {
  type: "invalid";
  response: string;
  id: string;
}

export interface ChatReduxType {
  loading: boolean;
  typing: boolean;
  error: boolean;
  contextIncident: string | null;
  likelyCause: null | ChatLikelyCauseType;
  queries: Array<ChatQueryType | ChatContextEventType | ChatInvalidCardType>;
}
