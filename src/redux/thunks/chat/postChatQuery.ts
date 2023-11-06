import {
  type ActionReducerMapBuilder,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  type ChatEventQueryType,
  type ChatReduxType,
} from "redux/chat/chatTypes";
import { type APIResponse } from "utils/generic/types";
import { CHAT_EVENTS } from "utils/gpt/constants";
import { GPT_EVENTS_ENDPOINT } from "utils/gpt/endpoints";
import raxios from "utils/raxios";

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

export const postChatQueryBuilder = (
  builder: ActionReducerMapBuilder<ChatReduxType>
) => {
  builder
    .addCase(postChatQuery.pending, (state, { meta }) => {
      const { arg } = meta;
      const id = arg.uid;
      state.queries.push({
        loading: true,
        error: false,
        typing: false,
        id,
        event: {
          type: CHAT_EVENTS.QUERY,
          query: arg.query,
          response: null,
        },
        incidentId: null,
        issueId: null,
      });
    })
    .addCase(postChatQuery.fulfilled, (state, { payload }) => {
      const idx = state.queries.findIndex((q) => q.id === payload.id);
      let query = state.queries[idx] as ChatEventQueryType;
      query = {
        ...query,
        loading: false,
        typing: true,
        error: false,
        event: {
          ...query.event,
          response: payload.event.response,
        },
        incidentId: payload.incidentId,
        issueId: payload.issueId,
      };
      state.queries[idx] = query;
    })
    .addCase(postChatQuery.rejected, (state, { meta }) => {
      const { arg } = meta;
      state.loading = false;
      const idx = state.queries.findIndex((q) => q.id === arg.uid);
      let query = state.queries[idx] as ChatEventQueryType;
      query = {
        ...query,
        loading: false,
        error: true,
        typing: false,
        event: {
          ...query.event,
          response: null,
        },
        incidentId: null,
        issueId: null,
      };
      state.queries[idx] = query;
    });
};
