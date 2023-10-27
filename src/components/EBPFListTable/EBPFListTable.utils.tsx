import { createColumnHelper } from "@tanstack/react-table";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { type EBPFIntegrationListType } from "utils/integrations/types";
import { type TableActionPropType } from "utils/tables/types";

const helper = createColumnHelper<EBPFIntegrationListType>();
export const getEBPFColumns = ({
  actions,
}: {
  actions: TableActionPropType<EBPFIntegrationListType>;
}) => {
  return [
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
  ];
};
