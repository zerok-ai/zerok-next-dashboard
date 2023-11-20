import { createColumnHelper } from "@tanstack/react-table";
import EnableDisableTableAction from "components/EnableDisableTableAction";
import TableActions from "components/helpers/TableActions";
import TableTimeCell from "components/TableTimeCell";
import ChipX from "components/themeX/ChipX";
import DialogX from "components/themeX/DialogX";
import ZkLink from "components/themeX/ZkLink";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import { type PrometheusListType } from "utils/integrations/types";
import {
  type TableActionItem,
  type TableSortOptions,
} from "utils/tables/types";

import styles from "./PrometheusTable.module.scss";

export const PROM_SORT_OPTIONS: TableSortOptions[] = [
  {
    label: "Created last",
    value: "updated_at:desc",
    sort: "desc",
  },
  {
    label: "Created first",
    value: "updated_at:asc",
    sort: "asc",
  },

  {
    label: "Updated first",
    value: "updated_at:asc",
    sort: "asc",
  },
  {
    label: "Updated last",
    value: "updated_at:desc",
    sort: "desc",
  },
];

export const renderPromTitle = (row: PrometheusListType) => {
  return (
    <ZkLink href={`/integrations/prometheus/edit?id=${row.id}`}>
      <span className={styles["int-title"]}>
        {row.alias}
        {row.disabled && <ChipX label="Disabled" />}
      </span>
    </ZkLink>
  );
};

export const getPromColumns = ({
  onUpdate,
  onDelete,
  onTest,
  selectedIntegration,
}: {
  onUpdate: (row: PrometheusListType) => void;
  onDelete: (row: PrometheusListType) => void;
  onTest: (row: PrometheusListType) => void;
  selectedIntegration: string | null;
}) => {
  const helper = createColumnHelper<PrometheusListType>();
  const columns = [
    helper.accessor("alias", {
      header: "Name",
      size: DEFAULT_COL_WIDTH * 2,
      cell: (cell) => {
        return renderPromTitle(cell.row.original);
      },
    }),
    helper.accessor("url", {
      header: "Host",
      size: DEFAULT_COL_WIDTH * 6,
    }),
    helper.accessor("level", {
      header: "Level",
      size: DEFAULT_COL_WIDTH,
      cell: (cell) => {
        return <ChipX label={cell.getValue()} />;
      },
    }),
    helper.accessor("updated_at", {
      header: "Last updated",
      size: DEFAULT_COL_WIDTH,
      cell: (cell) => <TableTimeCell time={cell.getValue()} epoch={false} />,
    }),
    helper.display({
      id: "actions",
      size: DEFAULT_COL_WIDTH / 2,
      cell: (cell) => {
        const row = cell.row.original;
        const actions: TableActionItem[] = [
          {
            element: <EnableDisableTableAction isEnabled={!row.disabled} />,
            onClick: () => {
              onUpdate(row);
            },
          },
          {
            element: <span>Delete</span>,
            onClick: () => {
              onDelete(row);
            },
          },
          {
            element: <span>Test connection</span>,
            onClick: () => {
              onTest(row);
            },
          },
        ];
        return (
          <TableActions
            list={actions}
            loading={selectedIntegration === row.id}
          />
        );
      },
    }),
  ];
  return columns;
};

export const PromDeleteDialog = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  return (
    <DialogX
      isOpen={true}
      title="Delete Probe"
      successText="Delete"
      cancelText="Cancel"
      onClose={onClose}
      onSuccess={onSuccess}
      onCancel={onClose}
    >
      <span>Are you sure you want to delete this integration?</span> <br />
      <em>This action cannot be undone.</em>
    </DialogX>
  );
};
