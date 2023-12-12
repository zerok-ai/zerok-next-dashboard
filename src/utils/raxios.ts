import axios from "axios";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { resetClusterState } from "redux/cluster";
import store from "redux/store";
import { logoutUser } from "redux/thunks/auth";

import { getSecondsToExpiry } from "./auth/functions";
import { HTTP_ERROR_CODES } from "./constants";

// use this client for any API requests with the BASE_URL

const raxios = axios.create({
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
});

raxios.interceptors.request.use((config) => {
  const token = Cookie.get("__session") as string;
  const decode = jwtDecode(token);
  const seconds = getSecondsToExpiry(decode.exp as number);
  console.log({ seconds });
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

raxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errResponse = error.response;
    const responseUrl = errResponse.request.responseURL as string;
    if (
      (errResponse.status === HTTP_ERROR_CODES.EXPIRED ||
        errResponse.data.error?.kind === "SESSION_EXPIRED") &&
      !responseUrl.includes("logout")
    ) {
      await store.dispatch(logoutUser());
      store.dispatch(resetClusterState());
      await Promise.resolve();
      return;
    }
    // @TODO - fix this jugaad
    if (
      (errResponse.status === HTTP_ERROR_CODES.EXPIRED ||
        errResponse.data.error?.kind === "SESSION_EXPIRED") &&
      responseUrl.includes("logout")
    ) {
      await Promise.resolve();
      return;
    }
    return await Promise.reject(error);
  }
);

export default raxios;

export const setRaxiosHeader = (token: string): boolean => {
  raxios.defaults.headers.common.Token = token;
  return true;
};

export const removeRaxiosHeader = (): boolean => {
  delete raxios.defaults.headers.common.Authorization;
  return true;
};

export const removeCluster = () => {
  localStorage.removeItem("zk-cluster");
};
