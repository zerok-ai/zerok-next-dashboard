import {
  type ActionReducerMapBuilder,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { type AuthType, type LoginAPIResponse } from "redux/auth/authTypes";
import { USER_DETAILS_ENDPOINT } from "utils/auth/endpoints";
import { removeLocalUser } from "utils/auth/functions";
import { type APIResponse } from "utils/generic/types";
import raxios from "utils/raxios";

export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUser",
  async (values: { token: string }) => {
    const rdata = await raxios.get<APIResponse<LoginAPIResponse>>(
      USER_DETAILS_ENDPOINT
    );
    return {
      profile: rdata.data.payload.userDetails,
      token: rdata.headers.token,
    };
  }
);

export const fetchUserDetailsBuilder = (
  builder: ActionReducerMapBuilder<AuthType>
) => {
  builder
    .addCase(fetchUserDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserDetails.fulfilled, (state, { payload, meta }) => {
      const { profile } = payload;
      state.token = meta.arg.token;
      state.loading = false;
      state.user = profile;
      state.isLoggedIn = true;
    })
    .addCase(fetchUserDetails.rejected, (state) => {
      state.error = "";
      state.loading = false;
      removeLocalUser();
    });
};
