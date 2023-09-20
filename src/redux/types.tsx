import { type CHAT_EVENTS } from "utils/gpt/constants";

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

export interface ChatEventBaseType {
  id: string;
  incidentId: string | null;
  issueId: string | null;
  loading: boolean;
  typing: boolean;
}

export interface ChatQueryEventType extends ChatEventBaseType {
  event: {
    type: typeof CHAT_EVENTS.QUERY;
    query: string;
    response: string | null;
  };
}

export interface ChatInferenceEventType extends ChatEventBaseType {
  event: {
    type: typeof CHAT_EVENTS.INFERENCE;
    response: {
      summary: string | null;
      data: string;
      anamolies: string | null;
    } | null;
  };
}

export interface ChatContextSwitchEventType extends ChatEventBaseType {
  event: {
    type: typeof CHAT_EVENTS.CONTEXT_SWITCH;
    oldIncidentID: string;
    newIncidentID: string;
  };
}

export interface ChatInvalidCardType {
  id: string;
  typing: false;
  incidentId?: string | null;
  issueId?: string | null;
  event: {
    type: typeof CHAT_EVENTS.INVALID;
    message?: string;
  };
}

export type ChatEventType =
  | ChatQueryEventType
  | ChatInferenceEventType
  | ChatContextSwitchEventType
  | ChatInvalidCardType;

export interface ChatLikelyCauseType {
  type: typeof CHAT_EVENTS.LIKELY_CAUSE;
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

export interface ChatReduxType {
  loading: boolean;
  typing: boolean;
  error: boolean;
  contextIncident: string | null;
  likelyCause: null | ChatLikelyCauseType;
  queries: ChatEventType[];
}
