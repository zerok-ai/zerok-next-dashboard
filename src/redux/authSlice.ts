import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DEFAULT_USER_PROFILE } from "utils/constants";
import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT } from "utils/endpoints";
import { deleteLocalToken, maskPassword, setLocalToken } from "utils/functions";
import raxios, { removeRaxiosHeader, setRaxiosHeader } from "utils/raxios";
import { type GenericObject } from "utils/types";

import { type RootState } from "./store";
import { type AuthType } from "./types";

const initialState: AuthType = {
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const setToken = (token: string): void => {
  setLocalToken(token);
  setRaxiosHeader(token);
};

const removeToken = (): void => {
  deleteLocalToken();
  removeRaxiosHeader();
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values: { email: string; password: string }) => {
    const { email, password } = values;
    const encrypted = maskPassword(password);
    const rdata = await raxios.post(LOGIN_ENDPOINT, {
      email,
      password: encrypted,
    });
    return rdata;
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  if (!window.location.pathname.includes("logout")) {
    localStorage.setItem("redirect", window.location.pathname);
  }
  return await raxios.get(LOGOUT_ENDPOINT);
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    tokenLogin: (state, { payload }: { payload: { token: string } }) => {
      state.token = payload.token;
      state.isLoggedIn = true;
      state.user = DEFAULT_USER_PROFILE;
      state.loading = false;
      setToken(payload.token);
    },
  },
  extraReducers: (builder) => {
    // LOGIN CASES
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: GenericObject) => {
        const token = action.payload.headers.token;
        state.token = token;
        state.loading = false;
        state.user = DEFAULT_USER_PROFILE;
        state.isLoggedIn = true;
        setToken(token);
      })
      .addCase(loginUser.rejected, (state) => {
        state.error = "Could not log in user, please try again.";
        state.loading = false;
        removeToken();
      });

    // LOGOUT CASES
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.isLoggedIn = false;
        state.user = null;
        removeToken();
      })
      .addCase(logoutUser.rejected, (state) => {
        state.token = null;
        state.isLoggedIn = false;
        state.user = null;
        removeToken();
        // @TODO - add error handling here
      });
  },
});

// Action creators are generated for each case reducer function
export const { tokenLogin } = authSlice.actions;
export const authSelector = (state: RootState): AuthType => state.auth;

export default authSlice.reducer;
