import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { CLUSTER_ENDPOINT } from "utils/endpoints";
import raxios from "utils/raxios";
import { ClusterReduxType } from "./types";

const initialState: ClusterReduxType = {
  loading: false,
  clusters: [],
  error: false,
  selectedCluster: "",
};

export const getClusters = createAsyncThunk("cluster/getClusters", async () => {
  try {
    const rdata = await raxios.get(CLUSTER_ENDPOINT);
    return rdata.data.payload.clusters;
  } catch (err) {
    throw "Could not get cluster list";
  }
});

export const clusterSlice = createSlice({
  name: "cluster",
  initialState,
  reducers: {
    setSelectedCluster: (state, { payload: { id } }) => {
      state.selectedCluster = id;
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
        if (action.payload.length) {
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
export const clusterSelector = (state: RootState) => state.cluster;

export const { setSelectedCluster } = clusterSlice.actions; 

export default clusterSlice.reducer;
