import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { CLUSTER_ENDPOINT } from "utils/endpoints";
import raxios from "utils/raxios";

import { type RootState } from "./store";
import { type ClusterReduxType } from "./types";

const initialState: ClusterReduxType = {
  loading: false,
  clusters: [],
  error: false,
  selectedCluster: "",
  renderTrigger: nanoid(),
};

export const getClusters = createAsyncThunk("cluster/getClusters", async () => {
  try {
    const rdata = await raxios.get(CLUSTER_ENDPOINT);
    return rdata.data.payload.clusters;
  } catch (err: unknown) {
    return { error: true, message: err };
  }
});

export const clusterSlice = createSlice({
  name: "cluster",
  initialState,
  reducers: {
    setSelectedCluster: (state, { payload: { id } }) => {
      state.selectedCluster = id;
    },
    triggerRefetch: (state) => {
      state.renderTrigger = nanoid();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClusters.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getClusters.fulfilled, (state, action) => {
        state.clusters = action.payload;
        state.loading = false;
        if (action.payload.length > 0) {
          state.selectedCluster = action.payload[0].id;
        }
      })
      .addCase(getClusters.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

// Action creators are generated for each case reducer function
export const clusterSelector = (state: RootState): ClusterReduxType =>
  state.cluster;

export const { setSelectedCluster, triggerRefetch } = clusterSlice.actions;

export default clusterSlice.reducer;
