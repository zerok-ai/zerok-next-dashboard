import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { type CHAT_EVENT_ENUM, CHAT_EVENTS } from "utils/gpt/constants";
import {
  GPT_EVENTS_ENDPOINT,
  GPT_HISTORY_ENDPOINT,
  GPT_INCIDENT_ENDPOINT,
} from "utils/gpt/endpoints";
import raxios from "utils/raxios";

import store, { type RootState } from "./store";
import { type ChatQueryEventType, type ChatReduxType } from "./types";

const initialState: ChatReduxType = {
  loading: false,
  error: false,
  queries: [],
  history: [],
  likelyCause: null,
  contextIncident: null,
  typing: false,
  eventLoading: false,
  chatLoading: false,
  historyLoading: false,
  pastEventCount: null,
};

interface ChatEventActionType {
  payload: {
    type: (typeof CHAT_EVENT_ENUM)[number];
    newIncidentID: string;
  };
}

interface ChatQueryActionType {
  payload:
    | {
        type: typeof CHAT_EVENTS.QUERY;
        query: string;
        key: string;
      }
    | {
        type: "infer";
        key: string;
      };
}

interface ChatEventRequestBaseType {
  issueId: string;
  incidentId: string;
}

interface ChatContextRequestType extends ChatEventRequestBaseType {
  event: {
    type: typeof CHAT_EVENTS.CONTEXT_SWITCH;
    request: {
      newIncident: string;
      oldIncident: string;
    };
  };
}

interface ChatQueryRequestType extends ChatEventRequestBaseType {
  event: {
    type: typeof CHAT_EVENTS.QUERY;
    request: {
      query: string;
    };
  };
}

interface ChatInferenceRequestType extends ChatEventRequestBaseType {
  event: {
    type: typeof CHAT_EVENTS.INFERENCE;
  };
}

export const fetchLikelyCause = createAsyncThunk(
  "chat/fetchLikelyCause",
  async (values: { issueId: string; selectedCluster: string }) => {
    const { issueId, selectedCluster } = values;
    const endpoint = GPT_INCIDENT_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster
    );
    const rdata = await raxios.post(endpoint, {
      issueId,
    });
    return rdata.data.payload;
  }
);

export const fetchQueryResponse = createAsyncThunk(
  "chat/fetchQueryResponse",
  async (
    values: {
      query: string;
      issueId: string;
      selectedCluster: string;
    },
    { getState }
  ) => {
    const { issueId, selectedCluster } = values;
    const state: RootState = getState() as RootState;
    const endpoint = GPT_EVENTS_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster
    );
    const body: ChatQueryRequestType = {
      issueId,
      incidentId: state.chat.contextIncident!,
      event: {
        type: CHAT_EVENTS.QUERY,
        request: {
          query: values.query,
        },
      },
    };
    const key = nanoid();
    store.dispatch(
      addQuery({
        query: values.query,
        key,
        type: CHAT_EVENTS.QUERY,
      })
    );
    const rdata = await raxios.post(endpoint, body);
    return {
      ...rdata.data.payload,
      key,
    };
  }
);

export const postContextEvent = createAsyncThunk(
  "chat/postContextEvent",
  async (
    values: {
      issueId: string;
      incidentId: string;
      selectedCluster: string;
    },
    { getState }
  ) => {
    const { issueId, incidentId, selectedCluster } = values;
    const state: RootState = getState() as RootState;
    const endpoint = GPT_EVENTS_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster
    );
    store.dispatch(startLoading("event"));
    const body: ChatContextRequestType = {
      issueId,
      incidentId,
      event: {
        type: CHAT_EVENTS.CONTEXT_SWITCH,
        request: {
          newIncident: incidentId,
          oldIncident: state.chat.contextIncident!,
        },
      },
    };
    await raxios.post(endpoint, body);
    return {
      ...body,
    };
  }
);

export const fetchNewInference = createAsyncThunk(
  "chat/fetchNewInference",
  async (values: {
    issueId: string;
    incidentId: string;
    selectedCluster: string;
  }) => {
    const { issueId, incidentId, selectedCluster } = values;
    const id = nanoid();
    store.dispatch(
      addQuery({
        type: "infer",
        key: id,
      })
    );
    const endpoint = GPT_EVENTS_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster
    );
    const body: ChatInferenceRequestType = {
      issueId,
      incidentId,
      event: {
        type: CHAT_EVENTS.INFERENCE,
      },
    };

    const rdata = await raxios.post(endpoint, body);
    return { ...rdata.data.payload, id };
  }
);

interface ChatQueryEventResponseType extends ChatQueryEventType {
  created_at: string;
}

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
    store.dispatch(startLoading("history"));
    const rdata = await raxios.get(endpoint);
    return rdata.data.payload as {
      issueId: string;
      total_count: number;
      events: ChatQueryEventResponseType[];
    };
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addEvent: (state, { payload }: ChatEventActionType) => {
      const { type, newIncidentID } = payload;
      if (type === CHAT_EVENTS.CONTEXT_SWITCH) {
        state.queries.push({
          incidentId: newIncidentID,
          issueId: null,
          id: nanoid(),
          loading: false,
          typing: false,
          event: {
            type: CHAT_EVENTS.CONTEXT_SWITCH,
            newIncidentID,
            oldIncidentID: state.contextIncident!,
          },
        });
        state.contextIncident = newIncidentID;
      } else return state;
    },
    addQuery: (state, { payload }: ChatQueryActionType) => {
      if (payload.type === CHAT_EVENTS.QUERY) {
        state.queries.push({
          incidentId: state.contextIncident,
          issueId: null,
          id: payload.key,
          loading: false,
          typing: true,
          event: {
            type: CHAT_EVENTS.QUERY,
            query: payload.query,
            response: null,
          },
        });
      } else {
        state.queries.push({
          incidentId: state.contextIncident,
          issueId: null,
          id: payload.key,
          loading: false,
          typing: true,
          event: {
            type: CHAT_EVENTS.INFERENCE,
            response: null,
          },
        });
      }
    },
    addInvalidCard: (state, { payload }: { payload: string }) => {
      state.queries.push({
        id: nanoid(),
        typing: false,
        event: {
          type: CHAT_EVENTS.INVALID,
          message: payload,
        },
      });
    },
    stopLikelyCauseTyping: (state) => {
      state.typing = false;
      if (state.likelyCause) {
        state.likelyCause.typing = false;
      }
    },
    stopTyping: (state, { payload }: { payload: string }) => {
      const queryIndex = state.queries.findIndex((q) => q.id === payload);
      const query = state.queries[queryIndex];
      if (query) {
        query.typing = false;
        state.queries[queryIndex] = query;
      }
      state.typing = false;
    },
    resetChat: (state) => {
      return initialState;
    },
    startLoading: (
      state,
      { payload }: { payload: "event" | "history" | "chat" }
    ) => {
      if (payload === "event") state.eventLoading = true;
      if (payload === "history") state.historyLoading = true;
      if (payload === "chat") state.chatLoading = true;
    },
    stopLoading: (
      state,
      { payload }: { payload: "event" | "history" | "chat" }
    ) => {
      if (payload === "event") state.eventLoading = false;
      if (payload === "history") state.historyLoading = false;
      if (payload === "chat") state.chatLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikelyCause.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchLikelyCause.fulfilled, (state, { payload }) => {
        const { issueId, incidentId, inference } = payload;
        const typing = state.queries.length === 0;
        state.likelyCause = {
          type: CHAT_EVENTS.LIKELY_CAUSE,
          response: inference,
          incidentId,
          issueId,
          typing,
          id: nanoid(),
        };
        state.loading = false;
        state.typing = true;
        state.error = false;
        state.contextIncident = incidentId;
      })
      .addCase(fetchLikelyCause.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      // queries
      .addCase(fetchQueryResponse.fulfilled, (state, { payload }) => {
        const { key } = payload;
        const query = state.queries.find((q) => q.id === key);
        if (query && query.event.type === CHAT_EVENTS.QUERY) {
          query.event.response = payload.event.response;
          query.typing = true;
          query.incidentId = state.contextIncident;
        }
      })
      .addCase(fetchQueryResponse.rejected, (state, { payload }) => {})
      // inference
      .addCase(fetchNewInference.fulfilled, (state, { payload }) => {
        const infer = state.queries.find(
          (q) => q.event.type === CHAT_EVENTS.INFERENCE && q.id === payload.id
        );
        if (infer && infer.event.type === CHAT_EVENTS.INFERENCE) {
          infer.event.response = payload.event.response;
          infer.typing = true;
          infer.incidentId = payload.incidentId;
          infer.issueId = payload.issueId;
        }
      })
      // context
      .addCase(postContextEvent.fulfilled, (state, { payload }) => {
        if (payload.event.type === CHAT_EVENTS.CONTEXT_SWITCH) {
          // @ts-expect-error - TS gymnastics
          state.queries.push({ ...payload, id: nanoid(), typing: false });
          state.contextIncident = payload.event.request.newIncident;
          state.eventLoading = false;
        }
      })
      .addCase(postContextEvent.rejected, (state) => {
        state.eventLoading = false;
      })
      // history
      .addCase(fetchPastEvents.fulfilled, (state, { payload }) => {
        const queries = payload.events.map((e) => {
          return {
            ...e,
            id: nanoid(),
            typing: false,
          };
        });
        state.queries = [...queries, ...state.queries];
        state.pastEventCount = payload.total_count;
        state.history = payload.events;
        state.historyLoading = false;
      });
  },
});

// Action creators are generated for each case reducer function

export const {
  addEvent,
  addInvalidCard,
  stopLikelyCauseTyping,
  addQuery,
  stopTyping,
  resetChat,
  stopLoading,
  startLoading,
} = chatSlice.actions;

export const chatSelector = (state: RootState): ChatReduxType => state.chat;

export default chatSlice.reducer;
