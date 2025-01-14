import {
  type ActionReducerMapBuilder,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { type AuthType, type LoginAPIResponse } from "redux/auth/authTypes";
import { LOGIN_ENDPOINT } from "utils/auth/endpoints";
import { removeLocalUser, setRaxiosLocalToken } from "utils/auth/functions";
import { maskPassword } from "utils/functions";
import { type APIResponse } from "utils/generic/types";
import raxios from "utils/raxios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values: { email: string; password: string }) => {
    const { email, password } = values;
    const encrypted = maskPassword(password);
    const rdata = await raxios.post<APIResponse<LoginAPIResponse>>(
      LOGIN_ENDPOINT,
      {
        email,
        password: encrypted,
      }
    );
    return {
      token: rdata.headers.token,
    };
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
      state.token = payload.token;
      state.loading = false;
      state.isLoggedIn = true;
      setRaxiosLocalToken(payload.token);
    })
    .addCase(loginUser.rejected, (state) => {
      state.error = "Could not log in user, please try again.";
      state.loading = false;
      removeLocalUser();
    });
};
