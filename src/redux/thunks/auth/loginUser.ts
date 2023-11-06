import {
  type ActionReducerMapBuilder,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { type AuthType } from "redux/types";
import { LOGIN_ENDPOINT } from "utils/auth/endpoints";
import { removeToken, setRaxiosLocalToken } from "utils/auth/functions";
import { DEFAULT_USER_PROFILE } from "utils/constants";
import { maskPassword } from "utils/functions";
import raxios from "utils/raxios";

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

export const loginUserBuilder = (
  builder: ActionReducerMapBuilder<AuthType>
) => {
  builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, { payload }) => {
      const token = payload.headers.token;
      state.token = token;
      state.loading = false;
      state.user = DEFAULT_USER_PROFILE;
      state.isLoggedIn = true;
      setRaxiosLocalToken(token);
    })
    .addCase(loginUser.rejected, (state) => {
      state.error = "Could not log in user, please try again.";
      state.loading = false;
      removeToken();
    });
};
