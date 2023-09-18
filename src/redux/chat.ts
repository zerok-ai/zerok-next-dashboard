import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { GPT_INCIDENT_ENDPOINT } from "utils/gpt/endpoints";
import raxios from "utils/raxios";

import { type RootState } from "./store";
import { type ChatReduxType } from "./types";

const initialState: ChatReduxType = {
  loading: false,
  error: false,
  queries: [],
  likelyCause: null,
};

interface ChatEventActionType {
  payload: {
    type: "CONTEXT";
    oldIncidentID: string;
    newIncidentID: string;
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

export const chatSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    addEvent: (state, { payload }: ChatEventActionType) => {
      const { type, oldIncidentID, newIncidentID } = payload;
      if (type === "CONTEXT") {
        state.queries.push({
          type: "context",
          oldIncidentID,
          newIncidentID,
          id: nanoid(),
        });
      } else return state;
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
      })
      .addCase(fetchLikelyCause.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

// Action creators are generated for each case reducer function

export const { addEvent, addInvalidCard, stopLikelyCauseTyping } =
  chatSlice.actions;

export const chatSelector = (state: RootState): ChatReduxType => state.chat;

export default chatSlice.reducer;
