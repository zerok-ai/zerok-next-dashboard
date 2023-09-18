import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { nanoid } from "nanoid";
import { sleep } from "utils/functions";
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
};

interface ChatEventActionType {
  payload: {
    type: "CONTEXT";
    newIncidentID: string;
  };
}

interface ChatQueryActionType {
  payload: {
    query: string;
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

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addEvent: (state, { payload }: ChatEventActionType) => {
      const { type, newIncidentID } = payload;
      if (type === "CONTEXT") {
        state.queries.push({
          type: "context",
          oldIncidentID: state.contextIncident!,
          newIncidentID,
          id: nanoid(),
        });
        state.contextIncident = newIncidentID;
      } else return state;
    },
    addQuery: (state, { payload }: ChatQueryActionType) => {
      state.queries.push({
        type: "query",
        query: payload.query,
        id: payload.key,
        typing: false,
        incidentId: null,
        response: null,
      });
    },
    addInvalidCard: (state, { payload }: { payload: string }) => {
      state.queries.push({
        type: "invalid",
        response: payload,
        id: nanoid(),
      });
    },
    stopLikelyCauseTyping: (state) => {
      if (state.likelyCause) {
        state.likelyCause.typing = false;
      }
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
          type: "infer",
          response: inference,
          incidentId,
          issueId,
          typing,
          id: nanoid(),
        };
        state.loading = false;
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
        if (query && query.type === "query") {
          query.response = inference.eventResponse;
          query.typing = true;
          query.incidentId = state.contextIncident;
        }
      })
      .addCase(fetchQueryResponse.rejected, (state, { payload }) => {
        console.log("heer");
      });
  },
});

// Action creators are generated for each case reducer function

export const { addEvent, addInvalidCard, stopLikelyCauseTyping, addQuery } =
  chatSlice.actions;

export const chatSelector = (state: RootState): ChatReduxType => state.chat;

export default chatSlice.reducer;
