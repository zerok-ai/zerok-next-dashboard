// import { LinearProgress } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { DEFAULT_COL_WIDTH } from "utils/constants";
// import { getFormattedTime } from "utils/dateHelpers";
import { type OtelIntegrationListType } from "utils/integrations/types";

const helper = createColumnHelper<OtelIntegrationListType>();
export const OTEL_COLUMNS = [
  helper.accessor("name", {
    header: "Clusters",
    size: DEFAULT_COL_WIDTH * 2,
  }),
  // helper.accessor("created_at", {
  //   header: "Created at",
  //   size: DEFAULT_COL_WIDTH,
  //   cell: (info) => {
  //     return getFormattedTime(info.getValue());
  //   },
  // }),
  // helper.accessor("created_by", {
  //   header: "Created by",
  //   size: DEFAULT_COL_WIDTH,
  // }),
  // helper.accessor("updated_at", {
  //   header: "Last updated",
  //   size: DEFAULT_COL_WIDTH,
  //   cell: (info) => {
  //     return getFormattedTime(info.getValue());
  //   },
  // }),
  // helper.accessor("integration_status", {
  //   header: "Completion status",
  //   size: DEFAULT_COL_WIDTH / 2,
  //   cell: (info) => {
  //     return <LinearProgress value={info.getValue()} variant="determinate" />;
  //   },
  // }),
];
