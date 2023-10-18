import { createColumnHelper } from "@tanstack/react-table";
import TableActions from "components/TableActions";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { type ObfuscationRuleType } from "utils/data/types";
import { getFormattedTime } from "utils/dateHelpers";
import { type TableActionListType } from "utils/generic/types";

export const getObfuscationColumns = ({
  actions,
}: {
  actions: Array<TableActionListType<ObfuscationRuleType>>;
}) => {
  const helper = createColumnHelper<ObfuscationRuleType>();
  const columns = [
    helper.accessor("name", {
      header: "Name",
      size: DEFAULT_COL_WIDTH,
    }),
    helper.accessor("analyzer.pattern", {
      header: "Pattern",
      size: DEFAULT_COL_WIDTH * 4,
    }),
    helper.accessor("analyzer.type", {
      header: "Created by",
      size: DEFAULT_COL_WIDTH,
    }),
    helper.accessor("updated_at", {
      header: "Last updated",
      size: DEFAULT_COL_WIDTH / 1.2,
      cell: (info) => {
        return getFormattedTime(info.getValue());
      },
    }),
    helper.display({
      id: "actions",
      size: DEFAULT_COL_WIDTH / 2,
      cell: (info) => {
        return (
          <TableActions<ObfuscationRuleType>
            list={actions}
            data={info.row.original}
          />
        );
      },
    }),
  ];
  return columns;
};
