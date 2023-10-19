import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CLUSTER_STATES } from "utils/constants";
import { CLUSTER_ENDPOINT } from "utils/endpoints";
import {
  getClusterFromLocalStorage,
  setClusterToLocalStorage,
} from "utils/functions";
import raxios from "utils/raxios";

import { type RootState } from "./store";
import { type ClusterReduxType, type ClusterType } from "./types";

const initialState: ClusterReduxType = {
  loading: false,
  clusters: [],
  empty: false,
  error: false,
  selectedCluster: "",
  status: "",
  isClusterModalOpen: false,
};

export const getClusters = createAsyncThunk("cluster/getClusters", async () => {
  try {
    const rdata = await raxios.get(CLUSTER_ENDPOINT);
    return rdata.data.payload.clusters;
  } catch (err: unknown) {
    throw new Error((err as Error).message);
  }
});

export const clusterSlice = createSlice({
  name: "cluster",
  initialState,
  reducers: {
    setSelectedCluster: (state, { payload: { id } }) => {
      state.selectedCluster = id;
      const cluster = state.clusters.find((c) => c.id === id);
      setClusterToLocalStorage(cluster ? cluster.id : "");
      state.status = cluster ? cluster.status : "";
    },
    openClusterModal: (state) => {
      state.isClusterModalOpen = true;
    },
    closeClusterModal: (state) => {
      state.isClusterModalOpen = false;
    },
    changeSelectedCluster: (state, { payload: { id } }) => {
      if (id !== state.selectedCluster) {
        const cluster = state.clusters.find((c) => c.id === id);
        if (cluster) {
          state.selectedCluster = id;
          state.status = cluster.status;
          setClusterToLocalStorage(cluster.id);
        }
      }
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
          state.empty = false;
          const localCluster = getClusterFromLocalStorage();
          // check if the saved cluster is in the list of clusters
          if (localCluster) {
            const cluster = action.payload.find((c: ClusterType) => {
              return c.id === localCluster;
            });
            if (cluster) {
              state.selectedCluster = cluster.id;
              state.status = cluster.status;
              return;
            }
          }
          // if there is no saved cluster, select the first healthy cluster
          if (action.payload.length > 1) {
            const healthyCluster = action.payload.find((c: ClusterType) => {
              return (
                c.status === CLUSTER_STATES.HEALTHY ||
                c.status === CLUSTER_STATES.DEGRADED
              );
            });
            if (healthyCluster) {
              state.selectedCluster = healthyCluster.id;
              state.status = healthyCluster.status;
              return;
            }
          }
          state.selectedCluster = action.payload[0].id;
          state.status = action.payload[0].status;
        } else {
          state.empty = true;
          state.selectedCluster = null;
        }
      })
      .addCase(getClusters.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.status = "";
      });
  },
});

// Action creators are generated for each case reducer function
export const clusterSelector = (state: RootState): ClusterReduxType =>
  state.cluster;

export const {
  setSelectedCluster,
  openClusterModal,
  closeClusterModal,
  changeSelectedCluster,
} = clusterSlice.actions;

export default clusterSlice.reducer;
