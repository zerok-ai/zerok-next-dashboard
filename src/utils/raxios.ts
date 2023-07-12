import axios from "axios";
import { HTTP_ERROR_CODES } from "./constants";
import store from "redux/store";
import { logoutUser } from "redux/authSlice";

// use this client for any API requests with the BASE_URL

const raxios = axios.create({
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

raxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const errResponse = error.response;
    if (
      (errResponse.status === HTTP_ERROR_CODES.EXPIRED ||
        errResponse.data.error?.kind === "SESSION_EXPIRED") &&
      !errResponse.request.responseURL.includes("logout")
    ) {
      store.dispatch(logoutUser());
      Promise.resolve();
      return;
    }
    // @TODO - fix this jugaad
    if (
      (errResponse.status === HTTP_ERROR_CODES.EXPIRED ||
        errResponse.data.error?.kind === "SESSION_EXPIRED") &&
      errResponse.request.responseURL.includes("logout")
    ) {
      Promise.resolve();
      return;
    }
    return Promise.reject(error);
  }
);

export default raxios;

export const setRaxiosHeader = (token: string) => {
  raxios.defaults.headers.common["Token"] = token;
  return true;
};

export const removeRaxiosHeader = () => {
  delete raxios.defaults.headers.common["Authorization"];
  return true;
};
