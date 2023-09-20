import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { nanoid } from "nanoid";
import { sleep } from "utils/functions";
import { type CHAT_EVENT_ENUM, CHAT_EVENTS } from "utils/gpt/constants";
import { GPT_INCIDENT_ENDPOINT } from "utils/gpt/endpoints";
import raxios from "utils/raxios";

import store, { type RootState } from "./store";
import { type ChatReduxType } from "./types";

const initialState: ChatReduxType = {
  loading: false,
  error: false,
  queries: [],
  likelyCause: null,
  contextIncident: null,
  typing: false,
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
  async (values: {
    query: string;
    issueId: string;
    incidentId: string;
    selectedCluster: string;
  }) => {
    const key = nanoid();
    store.dispatch(
      addQuery({
        query: values.query,
        key,
        type: CHAT_EVENTS.QUERY,
      })
    );
    await sleep(2000);
    const rdata = await axios.get("/gpt.json");
    return {
      inference: rdata.data.payload,
      key,
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
    store.dispatch(
      addQuery({
        type: "infer",
        key: nanoid(),
      })
    );
    await sleep(2000);

    const rdata = await axios.get("/gpt.json");
    return rdata.data.payload;
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
        const { inference, key } = payload;
        const query = state.queries.find((q) => q.id === key);
        if (query && query.event.type === CHAT_EVENTS.QUERY) {
          query.event.response = inference.eventResponse;
          query.typing = true;
          query.incidentId = state.contextIncident;
        }
      })
      .addCase(fetchQueryResponse.rejected, (state, { payload }) => {
        console.log("heer");
      })
      // inference
      .addCase(fetchNewInference.fulfilled, (state, { payload }) => {
        const infer = state.queries.find(
          (q) => q.event.type === CHAT_EVENTS.INFERENCE
        );
        if (infer && infer.event.type === CHAT_EVENTS.INFERENCE) {
          infer.event.response = {
            data: payload.eventResponse as string,
            anamolies: null,
            summary: null,
          };
          infer.typing = true;
          infer.incidentId = payload.incidentId;
          infer.issueId = payload.issueId;
        }
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
} = chatSlice.actions;

export const chatSelector = (state: RootState): ChatReduxType => state.chat;

export default chatSlice.reducer;
