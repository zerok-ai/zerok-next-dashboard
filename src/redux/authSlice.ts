import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DEFAULT_USER_PROFILE } from "utils/constants";
import { deleteLocalToken, maskPassword, setLocalToken } from "utils/functions";
import { RootState } from "./store";
import raxios, { removeRaxiosHeader, setRaxiosHeader } from "utils/raxios";
import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT } from "utils/endpoints";
import { AuthType } from "./types";

const initialState: AuthType = {
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const setToken = (token: string) => {
  setLocalToken(token);
  setRaxiosHeader(token);
};

const removeToken = () => {
  deleteLocalToken();
  removeRaxiosHeader();
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values: { email: string; password: string }) => {
    try {
      const { email, password } = values;
      const encrypted = maskPassword(password);
      const rdata = await raxios.post(LOGIN_ENDPOINT, {
        email,
        password: encrypted,
      });
      return rdata;
    } catch (err) {
      throw "Could not log in";
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  return raxios.get(LOGOUT_ENDPOINT);
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
    // @TODO - make this DRYer
    // LOGIN CASES
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
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
export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
