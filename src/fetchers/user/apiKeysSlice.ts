import {
  APIKEY_CREATE_ENDPOINT,
  APIKEY_ID_ENDPOINT,
  APIKEYS_ENDPOINT,
  TOP_APIKEY_ENDPOINT,
} from "utils/endpoints";
import { type ApiKeyDetail } from "utils/types";

import { fetcher } from "../fetcherSlice";

type ApiKeyDetailWithToggle = ApiKeyDetail & { visible: boolean };

const extendedApi = fetcher.injectEndpoints({
  endpoints: (build) => ({
    listApiKeys: build.query<ApiKeyDetailWithToggle[], void>({
      query: () => {
        return {
          url: APIKEYS_ENDPOINT,
        };
      },
      providesTags: ["apikeys"],
      transformResponse: (response: { apikeys: ApiKeyDetail[] }) => {
        return response.apikeys.map((akey) => {
          return { ...akey, visible: false };
        });
      },
    }),
    getApiKey: build.query<ApiKeyDetail, string>({
      query: (code) => {
        const endpoint = APIKEY_ID_ENDPOINT.replace("{id}", code);
        return {
          url: endpoint,
        };
      },
      transformResponse: (response: { apikey: ApiKeyDetail }) => {
        return response.apikey;
      },
      providesTags: ["apikeys"],
    }),
    createApiKey: build.mutation<void, void>({
      query: () => {
        return {
          url: APIKEY_CREATE_ENDPOINT,
          method: "GET",
        };
      },
      invalidatesTags: ["apikeys"],
    }),
    deleteApiKey: build.mutation<undefined, string>({
      query: (code) => {
        const endpoint = APIKEY_ID_ENDPOINT.replace("{id}", code);
        return {
          url: endpoint,
          method: "DELETE",
        };
      },
      invalidatesTags: ["apikeys"],
    }),
    getTopApiKey: build.query<ApiKeyDetail, void>({
      query: () => {
        return {
          url: TOP_APIKEY_ENDPOINT,
        };
      },
      transformResponse: (response: { apikey: ApiKeyDetail }) => {
        return response.apikey;
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useListApiKeysQuery,
  useLazyGetApiKeyQuery,
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
  useLazyGetTopApiKeyQuery,
} = extendedApi;
