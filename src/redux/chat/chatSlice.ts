import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { CHAT_EVENTS } from "utils/gpt/constants";

import { type RootState } from "../store";
import {
  fetchLikelyCause,
  fetchPastEvents,
  postChatQuery,
  postNewChatEvent,
} from "./chatThunks";
import {
  type ChatEventInferenceType,
  type ChatEventQueryType,
  type ChatReduxType,
} from "./chatTypes";

const initialState: ChatReduxType = {
  queries: [],
  history: [],
  loading: false,
  likelyCause: {
    loading: false,
    typing: false,
    error: false,
    event: null,
    id: nanoid(),
  },
  contextIncident: null,
  historyCount: null,
  //   eventLoading: false,
  //   chatLoading: false,
  //   historyLoading: false,
  //   pastEventCount: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addTagCard: (state, { payload }: { payload: string }) => {
      state.queries.push({
        id: nanoid(),
        event: {
          type: CHAT_EVENTS.TAG,
          tag: payload,
        },
      });
    },
    stopLikelyCauseTyping: (state) => {
      state.likelyCause.typing = false;
    },
    stopTyping: (state, { payload }: { payload: string }) => {
      if (payload === state.likelyCause.id) {
        state.likelyCause.typing = false;
        return;
      }
      const queryIndex = state.queries.findIndex((q) => q.id === payload);
      const query = state.queries[queryIndex] as
        | ChatEventQueryType
        | ChatEventInferenceType;
      if (query) {
        query.typing = false;
        state.queries[queryIndex] = query;
      }
    },
    resetChat: (state) => {
      return initialState;
    },
  },

  //   ASYNC THUNKS
  extraReducers: (builder) => {
    /*
     **** LIKELY CAUSE ****
     */
    builder
      .addCase(fetchLikelyCause.pending, (state) => {
        state.likelyCause.loading = true;
        state.likelyCause.event = null;
      })
      .addCase(fetchLikelyCause.fulfilled, (state, { payload }) => {
        const { issueId, incidentId, inference } = payload;
        const typing = state.queries.length === 0;
        state.likelyCause.event = {
          inference: {
            ...inference,
          },
          incidentId,
          issueId,
        };
        state.likelyCause.loading = false;
        state.likelyCause.typing = typing;
        state.likelyCause.error = false;
        state.contextIncident = incidentId;
      })
      .addCase(fetchLikelyCause.rejected, (state) => {
        state.likelyCause.loading = false;
        state.likelyCause.error = true;
        state.likelyCause.event = null;
      })

      /*
       **** EVENTS ****
       */
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
      })

      /*
       **** QNA ****
       */
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
      })
      // history
      .addCase(fetchPastEvents.pending, (state) => {
        state.loading = CHAT_EVENTS.HISTORY;
      })
      .addCase(fetchPastEvents.fulfilled, (state, { payload }) => {
        const queries = payload.events.map((e) => {
          return {
            ...e,
            id: nanoid(),
            typing: false,
          };
        });
        state.queries = [...queries, ...state.queries];
        state.historyCount = payload.historyCount;
        state.history = payload.events;
        state.loading = false;
      });
  },
});

// Action creators are generated for each case reducer function

export const { stopLikelyCauseTyping, stopTyping, resetChat, addTagCard } =
  chatSlice.actions;

export const chatSelector = (state: RootState): ChatReduxType => state.chat;

export default chatSlice.reducer;
