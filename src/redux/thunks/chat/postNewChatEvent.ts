import {
  type ActionReducerMapBuilder,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import {
  type ChatEventContextSwitchType,
  type ChatEventInferenceType,
  type ChatReduxType,
} from "redux/chat/chatTypes";
import { type APIResponse } from "utils/generic/types";
import { CHAT_EVENTS } from "utils/gpt/constants";
import { GPT_EVENTS_ENDPOINT } from "utils/gpt/endpoints";
import raxios from "utils/raxios";

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

export const postNewChatEventBuilder = (
  builder: ActionReducerMapBuilder<ChatReduxType>
) => {
  builder
    .addCase(postNewChatEvent.pending, (state, { meta }) => {
      const { arg } = meta;
      const eventType = arg.type;
      state.loading = eventType;
    })
    .addCase(postNewChatEvent.fulfilled, (state, { payload }) => {
      const query = {
        ...payload,
        id: nanoid(),
        typing: true,
        loading: false,
        error: false,
      };
      state.loading = false;
      state.queries.push({ ...query });
      if (payload.event.type === CHAT_EVENTS.CONTEXT_SWITCH) {
        state.contextIncident = payload.event.newIncident;
      }
    })
    .addCase(postNewChatEvent.rejected, (state, { meta }) => {
      const { arg } = meta;
      const eventType = arg.type;
      state.loading = false;
      state.queries.push({
        id: nanoid(),
        error: true,
        event: {
          type: eventType,
        },
      });
    });
};
