import { type CHAT_EVENT_ENUM, type CHAT_EVENTS } from "utils/gpt/constants";

export interface ChatEventBaseType {
  id: string;
  incidentId: string;
  issueId: string;
  error: boolean;
  typing: boolean;
}

export interface ChatEventErrorType {
  id: string;
  error: true;
  event: {
    type: (typeof CHAT_EVENT_ENUM)[number];
  };
}

export interface ChatEventQueryType {
  loading: boolean;
  error: boolean;
  id: string;
  typing: boolean;
  event: {
    type: typeof CHAT_EVENTS.QUERY;
    query: string;
    response: string | null;
  };
  incidentId: string | null;
  issueId: string | null;
}

export interface ChatEventInferenceType extends ChatEventBaseType {
  event: {
    type: typeof CHAT_EVENTS.INFERENCE;
    response: {
      summary: string | null;
      data: string;
      anamolies: string | null;
    };
  };
}

export interface ChatEventContextSwitchType extends ChatEventBaseType {
  event: {
    type: typeof CHAT_EVENTS.CONTEXT_SWITCH;
    newIncident: string;
    oldIncident: string;
  };
}

export interface ChatEventTagType {
  id: string;
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
  //   | ChatQueryEventType
  | ChatEventInferenceType
  | ChatEventErrorType
  | ChatEventQueryType
  | ChatEventContextSwitchType
  | ChatEventTagType;
//   | ChatContextSwitchEventType
//   | ChatInvalidCardType

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
  historyCount: number | null;
  history: ChatEventType[];

  //   eventLoading: boolean;
  //   chatLoading: boolean;
  //   historyLoading: boolean;
  //   pastEventCount: number | null;
  //   likelyCauseError?: boolean;
  contextIncident: string | null;
  queries: ChatEventType[];
  loading: false | (typeof CHAT_EVENT_ENUM)[number];
  likelyCause: {
    id: string;
    loading: boolean;
    error: boolean;
    typing: boolean;
    event: ChatLikelyCauseType | null;
  };
}
