import { type CHAT_EVENTS } from "./constants";

export interface ChatCommandType {
  label: string;
  value: string;
  subtitle: string;
}

export interface ChatTagType {
  label: string;
  value: string;
}

export interface ChatTagGroupType {
  group: string;
  list: ChatTagType[];
}
export interface ChatLikelyCauseResponseType {
  inference: {
    summary: string | null;
    data: string;
    anamolies: string | null;
  };
  incidentId: string;
  issueId: string;
}

export interface ChatEventBaseResponseType {
  incidentId: string;
  issueId: string;
}

export interface ChatEventBaseReduxType {
  error: boolean;
  typing: boolean;
  loading: boolean;
  id: string;
}

export interface ChatEventInferenceResponseType
  extends ChatEventBaseResponseType {
  event: {
    type: typeof CHAT_EVENTS.INFERENCE;
    request: string;
    response: {
      summary: string | null;
      data: string;
      anamolies: string | null;
    };
  };
}
