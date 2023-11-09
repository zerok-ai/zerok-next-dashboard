import { createSlice } from "@reduxjs/toolkit";
import { loginUserBuilder, logoutUserBuilder } from "redux/thunks/auth";
import { fetchUserDetailsBuilder } from "redux/thunks/auth/fetchUserDetails";

import { type RootState } from "../store";
import { type AuthType } from "./authTypes";

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
  reducers: {},
  extraReducers: (builder) => {
    // LOGIN CASES
    loginUserBuilder(builder);
    // LOGOUT CASES
    logoutUserBuilder(builder);
    // TOKEN LOGIN CASES
    fetchUserDetailsBuilder(builder);
  },
});

// Action creators are generated for each case reducer function
// export const { tokenLogin } = authSlice.actions;
export const authSelector = (state: RootState): AuthType => state.auth;

export default authSlice.reducer;
