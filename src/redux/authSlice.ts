import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_USER_PROFILE } from "utils/constants";
import { deleteLocalToken, setLocalToken } from "utils/functions";
import { RootState } from "./store";

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
    setToken: (state, { payload }: { payload: { token: string } }) => {
      state.token = payload.token;
      state.user = DEFAULT_USER_PROFILE;
      state.isLoggedIn = true;
      setLocalToken(payload.token);
    },
    deleteToken: (state) => {
      state.token = null;
      deleteLocalToken();
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToken, deleteToken } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
