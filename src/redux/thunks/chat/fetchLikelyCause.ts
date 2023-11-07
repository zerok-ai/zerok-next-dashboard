import {
  type ActionReducerMapBuilder,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { type ChatReduxType } from "redux/chat/chatTypes";
import { type APIResponse } from "utils/generic/types";
import { GPT_INCIDENT_ENDPOINT } from "utils/gpt/endpoints";
import { type ChatLikelyCauseResponseType } from "utils/gpt/types";
import raxios from "utils/raxios";

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

export const likelyCauseBuilder = (
  builder: ActionReducerMapBuilder<ChatReduxType>
) => {
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
    });
};
