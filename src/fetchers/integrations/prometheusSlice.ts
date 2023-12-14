import { fetcher } from "fetchers/fetcherSlice";
import { getSelectedCluster } from "utils/generic/functions";
import {
  CREATE_INTEGRATION_ENDPOINT,
  DELETE_INTEGRATION_ENDPOINT,
  LIST_INTEGRATION_ENDPOINT,
} from "utils/integrations/endpoints";
import { type PrometheusListType } from "utils/integrations/types";

interface PrometheusStatusBodyParams {
  body: PrometheusListType;
}

const extendedApi = fetcher.injectEndpoints({
  endpoints: (build) => ({
    listPromIntegrations: build.query<PrometheusListType[], void>({
      query: () => {
        const cluster = getSelectedCluster() as string;
        const endpoint = LIST_INTEGRATION_ENDPOINT.replace(
          "{cluster_id}",
          cluster
        );
        return {
          url: endpoint,
        };
      },
      transformResponse: (response: { integrations: PrometheusListType[] }) => {
        return response.integrations;
      },
      providesTags: ["prometheus_integrations"],
    }),
    updatePrometheusStatus: build.mutation<void, PrometheusStatusBodyParams>({
      query: ({ body }) => {
        const cluster = getSelectedCluster() as string;
        const endpoint = CREATE_INTEGRATION_ENDPOINT.replace(
          "{cluster_id}",
          cluster
        );
        return {
          url: endpoint,
          body,
        };
      },
      invalidatesTags: ["prometheus_integrations"],
    }),
    deletePrometheusIntegration: build.mutation<void, string>({
      query: (integrationId) => {
        const cluster = getSelectedCluster() as string;
        const endpoint = DELETE_INTEGRATION_ENDPOINT.replace(
          "{cluster_id}",
          cluster
        ).replace("{integration_id}", integrationId);
        return {
          url: endpoint,
          method: "DELETE",
        };
      },
      invalidatesTags: ["prometheus_integrations"],
    }),
  }),
});

export const {
  useLazyListPromIntegrationsQuery,
  useUpdatePrometheusStatusMutation,
  useDeletePrometheusIntegrationMutation,
} = extendedApi;
