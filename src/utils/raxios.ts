import axios from "axios";
import { HTTP_ERROR_CODES } from "./constants";
import store from "redux/store";
import { logoutUser } from "redux/authSlice";

// use this client for any API requests with the BASE_URL

const raxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 8000,
  headers: {
    Accept: "application/json",
  },
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const errResponse = error.response;
    if (
      errResponse.status === HTTP_ERROR_CODES.EXPIRED ||
      errResponse.data.error?.kind === "SESSION_EXPIRED"
    ) {
      store.dispatch(logoutUser());
    }
    Promise.reject(error);
  }
);

export default raxios;

export const setRaxiosHeader = (token: string) => {
  raxios.defaults.headers.common["Authorization"] = token;
  return true;
};

export const removeRaxiosHeader = () => {
  delete raxios.defaults.headers.common["Authorization"];
  return true;
};
