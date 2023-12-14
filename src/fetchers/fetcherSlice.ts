// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi } from "@reduxjs/toolkit/query/react";

import raxiosBaseQuery from "./baseFetcher";

// initialize an empty api service that we'll inject endpoints into later as needed
export const fetcher = createApi({
  baseQuery: raxiosBaseQuery(),
  tagTypes: ["apikeys", "probes_list", "prometheus_integrations"],
  endpoints: () => ({}),
});
