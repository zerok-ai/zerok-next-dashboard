import { createColumnHelper } from "@tanstack/react-table";
import ApiKeyCode from "components/ApiKeyCode";
import TableActions from "components/helpers/TableActions";
import TableTimeCell from "components/TableTimeCell";
import { useMemo } from "react";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { type TableActionItem } from "utils/tables/types";
import { type ApiKeyDetail } from "utils/types";

import styles from "./ApiKeysPage.module.scss";

const colHelper = createColumnHelper<ApiKeyDetail>();

export const getApiKeyColumns = (
  apikeys: ApiKeyDetail[],
  deletingKey: string | null,
  setDeletingKey: (id: string) => void
) => {
  const columns = useMemo(() => {
    return [
      colHelper.accessor("id", {
        header: "ID",
        size: DEFAULT_COL_WIDTH * 2,
      }),
      colHelper.display({
        header: "API Key",
        size: DEFAULT_COL_WIDTH * 3,
        cell: (info) => {
          const row = info.row.original;
          const { id } = row;
          return (
            <div className={styles["key-code-container"]}>
              <ApiKeyCode code={id} />
            </div>
          );
        },
      }),
      colHelper.accessor("createdAtMs", {
        header: "Created at",
        size: DEFAULT_COL_WIDTH * 1.2,
        cell: (info) => {
          return <TableTimeCell time={info.getValue()} />;
        },
      }),
      colHelper.display({
        id: "actions",
        size: DEFAULT_COL_WIDTH / 3,
        cell: (info) => {
          const row = info.row.original;
          const actions: TableActionItem[] = [
            {
              element: <span>Delete</span>,
              onClick: () => {
                setDeletingKey(row.id);
              },
            },
          ];
          return (
            <TableActions list={actions} loading={row.id === deletingKey} />
          );
        },
      }),
    ];
  }, []);
  return columns;
};
