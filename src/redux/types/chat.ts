import { type CHAT_EVENTS } from "utils/gpt/constants";

export interface ChatEventBaseType {
  id: string;
  incidentId: string | null;
  issueId: string | null;
  error: boolean;
  typing: boolean;
  created_at?: string;
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

export interface ChatTagEventType extends ChatEventBaseType {
  event: {
    type: typeof CHAT_EVENTS.TAG;
    tag: string;
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
  | ChatInvalidCardType
  | ChatTagEventType;

export interface ChatLikelyCauseType {
  inference: {
    summary: string | null;
    data: string;
    anamolies: string | null;
  };
  incidentId: string;
  issueId: string;
}

export interface ChatReduxType {
  //   loading: boolean;
  //   typing: boolean;
  //   error: boolean;
  //
  //   likelyCause: null | ChatLikelyCauseType;
  //   history: ChatEventType[];
  //   eventLoading: boolean;
  //   chatLoading: boolean;
  //   historyLoading: boolean;
  //   pastEventCount: number | null;
  //   likelyCauseError?: boolean;
  contextIncident: string | null;
  queries: ChatEventType[];
  likelyCause: {
    loading: boolean;
    error: boolean;
    typing: boolean;
    event: ChatLikelyCauseType | null;
  };
}
