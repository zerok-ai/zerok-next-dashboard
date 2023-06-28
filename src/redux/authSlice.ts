import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DEFAULT_USER_PROFILE } from "utils/constants";
import { deleteLocalToken, setLocalToken } from "utils/functions";
import { RootState } from "./store";
import raxios, { removeRaxiosHeader, setRaxiosHeader } from "utils/raxios";
import { LOGOUT_ENDPOINT } from "utils/endpoints";

const initialState: AuthType = {
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  return raxios.get(LOGOUT_ENDPOINT);
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, { payload }: { payload: { token: string } }) => {
      state.token = payload.token;
      state.user = DEFAULT_USER_PROFILE;
      state.isLoggedIn = true;
      setLocalToken(payload.token);
      setRaxiosHeader(payload.token);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
      deleteLocalToken();
      removeRaxiosHeader();
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
      deleteLocalToken();
      removeRaxiosHeader();
      state.error = "Something went wrong, couldn't log user out cleanly.";
    });
  },
});

// Action creators are generated for each case reducer function
export const { loginUser } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
