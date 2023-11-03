import { createAsyncThunk } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { type RootState } from "redux/store";
import { type APIResponse } from "utils/generic/types";
import { CHAT_EVENTS } from "utils/gpt/constants";
import {
  GPT_EVENTS_ENDPOINT,
  GPT_HISTORY_ENDPOINT,
  GPT_INCIDENT_ENDPOINT,
} from "utils/gpt/endpoints";
import { type ChatLikelyCauseResponseType } from "utils/gpt/types";
import raxios from "utils/raxios";

import {
  type ChatEventContextSwitchType,
  type ChatEventInferenceType,
  type ChatEventQueryType,
  type ChatEventType,
} from "./chatTypes";

export const fetchLikelyCause = createAsyncThunk(
  "chat/fetchLikelyCause",
  async (values: { issueId: string; selectedCluster: string }) => {
    const { issueId, selectedCluster } = values;
    const endpoint = GPT_INCIDENT_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster
    );
    try {
      const rdata = await raxios.post<APIResponse<ChatLikelyCauseResponseType>>(
        endpoint,
        {
          issueId,
        }
      );
      return rdata.data.payload;
    } catch (err) {
      throw "Error fetching likely cause";
    }
  }
);

// All chat event thunk creator
type PostNewChatThunkParams =
  | {
      type: typeof CHAT_EVENTS.INFERENCE;
      issueId: string;
      incidentId: string;
      selectedCluster: string;
    }
  | {
      type: typeof CHAT_EVENTS.CONTEXT_SWITCH;
      issueId: string;
      incidentId: string;
      selectedCluster: string;
      newIncident: string;
    };
export const postNewChatEvent = createAsyncThunk(
  "chat/postNewChatEvent",
  async (values: PostNewChatThunkParams) => {
    const { issueId, incidentId, selectedCluster, type } = values;
    const id = nanoid();
    const { INFERENCE, CONTEXT_SWITCH } = CHAT_EVENTS;
    const getEventBody = () => {
      const body = {
        issueId,
        incidentId,
        event: {
          type,
        },
      };
      switch (type) {
        case INFERENCE:
          return body;
        case CONTEXT_SWITCH: {
          const newIncident = values.newIncident;
          return {
            ...body,
            event: {
              ...body.event,
              request: {
                newIncident,
                oldIncident: incidentId,
              },
            },
          };
        }
        default:
          return body;
      }
    };
    const body = getEventBody();
    const endpoint = GPT_EVENTS_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster
    );
    type EventResponseType = APIResponse<
      ChatEventInferenceType | ChatEventContextSwitchType
    >;
    const rdata = await raxios.post<EventResponseType>(endpoint, body);
    return { ...rdata.data.payload, id };
  }
);

interface PostChatQueryThunkParams {
  issueId: string;
  query: string;
  selectedCluster: string;
  incidentId: string;
  uid: string;
}

export const postChatQuery = createAsyncThunk(
  "chat/postChatQuery",
  async (values: PostChatQueryThunkParams) => {
    const { issueId, selectedCluster, incidentId, uid } = values;
    const body = {
      issueId,
      incidentId,
      event: {
        type: CHAT_EVENTS.QUERY,
        request: {
          query: values.query,
        },
      },
    };
    const endpoint = GPT_EVENTS_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster
    );
    type EventResponseType = APIResponse<ChatEventQueryType>;
    const rdata = await raxios.post<EventResponseType>(endpoint, body);
    return { ...rdata.data.payload, id: uid };
  }
);

export const fetchPastEvents = createAsyncThunk(
  "chat/fetchPastEvents",
  async (
    values: { issueId: string; selectedCluster: string },
    { getState }
  ) => {
    const { issueId, selectedCluster } = values;
    const state: RootState = getState() as RootState;
    const endpoint = GPT_HISTORY_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster
    )
      .replace("{issue_hash}", issueId)
      .replace("{offset}", state.chat.history.length.toString());
    const rdata = await raxios.get(endpoint);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return {
      historyCount: rdata.data.payload.total_count,
      events: rdata.data.payload.events,
    } as {
      historyCount: number;
      events: ChatEventType[];
    };
  }
);
