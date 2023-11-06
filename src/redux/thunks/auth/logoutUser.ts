import {
  type ActionReducerMapBuilder,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { type AuthType } from "redux/auth/authTypes";
import { LOGOUT_ENDPOINT } from "utils/auth/endpoints";
import { removeToken } from "utils/auth/functions";
import raxios from "utils/raxios";

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  if (!window.location.pathname.includes("logout")) {
    localStorage.setItem("redirect", window.location.pathname);
  }
  return await raxios.get(LOGOUT_ENDPOINT);
});

export const logoutUserBuilder = (
  builder: ActionReducerMapBuilder<AuthType>
) => {
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
    });
};
