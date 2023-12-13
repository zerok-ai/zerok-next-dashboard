import { getSelectedCluster } from "utils/generic/functions";
import {
  DELETE_PROBE_ENDPOINT,
  LIST_PROBES_ENDPOINT,
  UPDATE_PROBE_STATUS_ENDPOINT,
} from "utils/probes/endpoints";
import {
  type ProbeListResponseType,
  type ProbeListType,
} from "utils/probes/types";

import { fetcher } from "../fetcherSlice";

interface ProbeListParams {
  limit: number;
  offset: number;
  range: string;
}

interface ProbeUpdateParams {
  id: string;
  body: {
    action: "enable" | "disable";
  };
}

const extendedApi = fetcher.injectEndpoints({
  endpoints: (build) => ({
    getProbes: build.query<ProbeListResponseType, ProbeListParams>({
      query: ({ limit, offset, range }) => {
        const cluster = getSelectedCluster() as string;
        const endpoint = LIST_PROBES_ENDPOINT.replace("{cluster_id}", cluster);
        return {
          url: endpoint,
          params: {
            limit,
            offset,
            range,
          },
        };
      },
      transformResponse: (response: {
        scenarios: ProbeListType[];
        total_rows: number;
      }) => {
        return {
          scenarios: response.scenarios,
          total_rows: response.total_rows,
        };
      },
      providesTags: ["probes_list"],
    }),
    deleteProbe: build.mutation<void, string>({
      query: (probeId) => {
        const cluster = getSelectedCluster() as string;
        const endpoint = DELETE_PROBE_ENDPOINT.replace(
          "{cluster_id}",
          cluster
        ).replace("{scenario_id}", probeId);
        return {
          url: endpoint,
          method: "DELETE",
        };
      },
      invalidatesTags: ["probes_list"],
    }),
    updateProbe: build.mutation<void, ProbeUpdateParams>({
      query: ({ id, body }) => {
        const cluster = getSelectedCluster() as string;
        const endpoint = UPDATE_PROBE_STATUS_ENDPOINT.replace(
          "{cluster_id}",
          cluster
        ).replace("{scenario_id}", id);
        return {
          url: endpoint,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["probes_list"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLazyGetProbesQuery,
  useDeleteProbeMutation,
  useUpdateProbeMutation,
} = extendedApi;
