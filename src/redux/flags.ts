import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { posthog } from "utils/posthog.ts/init";

import { type RootState } from "./store";
import { type FlagReduxType } from "./types";

const initialState: FlagReduxType = {
  isDrawerMinimized: true,
  activeLink: null,
};

export const fetchAllFlags = createAsyncThunk(
  "flags/fetchAllFlags",
  async () => {
    try {
      const flags = await posthog.getAllFlagsAndPayloads("default");
      return flags;
    } catch (err: unknown) {
      throw new Error((err as Error).message);
    }
  }
);

export const flagSlice = createSlice({
  name: "flags",
  initialState,
  reducers: {
    resetFlags: (state) => {
      state.flags = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllFlags.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(fetchAllFlags.fulfilled, (state, { payload }) => {
      state.flags = payload;
    });
    builder.addCase(fetchAllFlags.rejected, (state, { payload }) => {
      console.log({ payload });
    });
  },
});

export const flagSelector = (state: RootState): FlagReduxType => state.flag;

export default flagSlice.reducer;
