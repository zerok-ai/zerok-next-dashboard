import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

import { type RootState } from "./store";
import { type SnackbarReduxType } from "./types";

const initialState: SnackbarReduxType = {
  open: false,
};

interface SnackbarActionType {
  payload: {
    type: "success" | "error" | "info";
    message: string;
  };
}

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action: SnackbarActionType) => {
      state.open = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.key = nanoid();
    },
    hideSnackbar: (state) => {
      return {
        open: false,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export const snackbarSelector = (state: RootState): SnackbarReduxType =>
  state.snackbar;

export default snackbarSlice.reducer;
