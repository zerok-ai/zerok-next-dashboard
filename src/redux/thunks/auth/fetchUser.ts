import {
  type ActionReducerMapBuilder,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { type AuthType, type LoginAPIResponse } from "redux/auth/authTypes";
import { LOGIN_ENDPOINT } from "utils/auth/endpoints";
import { removeToken, setRaxiosLocalToken } from "utils/auth/functions";
import raxios from "utils/raxios";

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (values: { token: string }) => {
    const rdata = await raxios.get<LoginAPIResponse>(LOGIN_ENDPOINT);
    return {
      profile: rdata.data.debug.authToken.UserDetails,
      token: rdata.headers.token,
    };
  }
);

export const loginUserBuilder = (
  builder: ActionReducerMapBuilder<AuthType>
) => {
  builder
    .addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUser.fulfilled, (state, { payload }) => {
      const profile = payload.profile;
      const token = payload.token;
      state.token = token;
      state.loading = false;
      state.user = profile;
      state.isLoggedIn = true;
      setRaxiosLocalToken(token);
    })
    .addCase(fetchUser.rejected, (state) => {
      state.error = "Could not log in user, please try again.";
      state.loading = false;
      removeToken();
    });
};
