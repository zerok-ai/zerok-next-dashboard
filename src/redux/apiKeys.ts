import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ApiKeyReduxType, ApiKeyType } from "./types";
import raxios from "utils/raxios";
import { APIKEY_ENDPOINT } from "utils/endpoints";

const initialState: ApiKeyReduxType = {
  loading: false,
  error: false,
  apiKeys: [],
};

export const getApiKeys = createAsyncThunk("apiKeys/getApiKeys", async () => {
  try {
    const rdata = await raxios.get(APIKEY_ENDPOINT);
    return rdata.data.payload.apikeys;
  } catch (err) {
    throw "Could not get API keys";
  }
});

export const apiKeySlice = createSlice({
  name: "apiKeys",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getApiKeys.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getApiKeys.fulfilled, (state, action) => {
        console.log({ action });
        state.apiKeys = action.payload;
        state.loading = false;
      })
      .addCase(getApiKeys.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const apiKeySelector = (state: RootState) => state.apiKeys;

export default apiKeySlice.reducer;
