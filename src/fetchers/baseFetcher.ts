import { type BaseQueryFn } from "@reduxjs/toolkit/dist/query";
import { type AxiosError, type AxiosRequestConfig } from "axios";
import raxios from "utils/raxios";

const raxiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig, unknown, AxiosError> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await raxios({
        url,
        method,
        data,
        params,
      });
      return { data: result.data.payload };
    } catch (axiosError) {
      const error = axiosError as AxiosError;
      return {
        error,
      };
    }
  };

export default raxiosBaseQuery;
