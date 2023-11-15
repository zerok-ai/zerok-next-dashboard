import { createColumnHelper } from "@tanstack/react-table";
// import EnableDisableTableAction from "components/EnableDisableTableAction";
// import TableActions from "components/helpers/TableActions";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { type EBPFIntegrationListType } from "utils/integrations/types";
// import { type TableActionItem } from "utils/tables/types";

const helper = createColumnHelper<EBPFIntegrationListType>();
export const getEBPFColumns = ({
  onUpdate,
}: {
  onUpdate: (row: EBPFIntegrationListType) => void;
}) => {
  return [
    helper.accessor("name", {
      header: "Clusters",
      size: DEFAULT_COL_WIDTH * 2,
    }),
    // helper.display({
    //   id: "actions",
    //   size: DEFAULT_COL_WIDTH / 4,
    //   cell: (info) => {
    //     const row = info.row.original;
    //     const actions: TableActionItem[] = [
    //       {
    //         element: <EnableDisableTableAction isEnabled={row.enabled} />,
    //         onClick: () => {
    //           onUpdate(row);
    //         },
    //       },
    //     ];
    //     return <TableActions list={actions} loading={false} />;
    //   },
    // }),
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
