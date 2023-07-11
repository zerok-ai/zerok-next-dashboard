import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { IncidentIDReduxType } from "./types";
import raxios from "utils/raxios";

const initialState: IncidentIDReduxType = {
  loading: false,
  incidentList: [],
  error: false,
  activeIndex: -1,
};

// export const getNextIncidents = createAsyncThunk(
//   "incident/getNextIncidents",
//   async (endpoint: string) => {
//     try {
//       const rdata = await raxios.get(endpoint);
//       return rdata.data.payload.incidents;
//     } catch (err) {
//       throw "Could not get Incidents";
//     }
//   }
// );

export const incidentListSlice = createSlice({
  name: "incidentList",
  initialState,
  reducers: {
    setIncidentList: (state, action) => {
      state.incidentList = action.payload;
    },
  },
});

export const incidentListSelector = (state: RootState) => state.incidentList;
export const { setIncidentList } = incidentListSlice.actions;
export default incidentListSlice.reducer;
