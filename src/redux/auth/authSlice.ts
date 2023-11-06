import { createSlice } from "@reduxjs/toolkit";
import { loginUserBuilder, logoutUserBuilder } from "redux/thunks/auth";
import { setRaxiosLocalToken } from "utils/auth/functions";
import { DEFAULT_USER_PROFILE } from "utils/constants";

import { type RootState } from "../store";
import { type AuthType } from "../types";

const initialState: AuthType = {
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    tokenLogin: (state, { payload }: { payload: { token: string } }) => {
      state.token = payload.token;
      state.isLoggedIn = true;
      state.user = DEFAULT_USER_PROFILE;
      state.loading = false;
      setRaxiosLocalToken(payload.token);
    },
  },
  extraReducers: (builder) => {
    // LOGIN CASES
    loginUserBuilder(builder);
    // LOGOUT CASES
    logoutUserBuilder(builder);
  },
});

// Action creators are generated for each case reducer function
export const { tokenLogin } = authSlice.actions;
export const authSelector = (state: RootState): AuthType => state.auth;

export default authSlice.reducer;
