import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import type { IncidentIDReduxType } from "./types";

const initialState: IncidentIDReduxType = {
  loading: false,
  incidentList: [],
  error: false,
  activeIndex: -1,
};

export const incidentListSlice = createSlice({
  name: "incidentList",
  initialState,
  reducers: {
    setIncidentList: (state, action) => {
      state.incidentList = action.payload;
    },
  },
});

export const incidentListSelector = (state: RootState): IncidentIDReduxType =>
  state.incidentList;

export const { setIncidentList } = incidentListSlice.actions;

export default incidentListSlice.reducer;
