import { createColumnHelper } from "@tanstack/react-table";
import cx from "classnames";
import EnableDisableTableAction from "components/EnableDisableTableAction";
import TableActions from "components/helpers/TableActions";
import TableTimeCell from "components/TableTimeCell";
import ChipX from "components/themeX/ChipX";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import {
  type DefaultRegexRuleType,
  type ObfuscationRuleType,
} from "utils/data/types";
import { type TableActionItem } from "utils/tables/types";

import styles from "./DataObfuscationPage.module.scss";

export const getObfuscationColumns = ({
  onEdit,
  onUpdate,
  selectedRule,
}: {
  onEdit: (row: ObfuscationRuleType) => void;
  onUpdate: (row: ObfuscationRuleType) => void;
  selectedRule: ObfuscationRuleType | null;
}) => {
  const helper = createColumnHelper<ObfuscationRuleType>();
  const columns = [
    helper.accessor("name", {
      header: "Name",
      size: DEFAULT_COL_WIDTH * 3,
      cell: (info) => {
        return (
          <div
            className={cx(
              styles["name-container"],
              !info.row.original.enabled && styles.disabled
            )}
          >
            <span
              onClick={() => {
                onEdit(info.row.original);
              }}
              className={styles["rule-name"]}
            >
              {info.getValue()}
            </span>
            {!info.row.original.enabled && (
              <ChipX label="Disabled" color="disabled" />
            )}
          </div>
        );
      },
    }),
    helper.accessor("analyzer.pattern", {
      header: "Pattern",
      size: DEFAULT_COL_WIDTH * 4,
    }),
    helper.accessor("created_by", {
      header: "Created by",
      size: DEFAULT_COL_WIDTH * 1.2,
    }),
    helper.accessor("updated_at", {
      header: "Last updated",
      size: DEFAULT_COL_WIDTH * 1.2,
      cell: (info) => <TableTimeCell time={info.getValue()} />,
    }),
    helper.display({
      id: "actions",
      size: DEFAULT_COL_WIDTH / 3,
      cell: (info) => {
        const row = info.row.original;
        const { enabled } = row;
        const actions: TableActionItem[] = [
          {
            element: <EnableDisableTableAction isEnabled={enabled} />,
            onClick: () => {
              onUpdate(row);
            },
          },
          {
            element: <span>Edit</span>,
            onClick: () => {
              onEdit(row);
            },
          },
        ];
        return (
          <TableActions list={actions} loading={selectedRule?.id === row.id} />
        );
      },
    }),
  ];
  return columns;
};

const rhelper = createColumnHelper<DefaultRegexRuleType>();

export const getRuleColumns = ({
  onRuleClick,
}: {
  onRuleClick: (row: DefaultRegexRuleType) => void;
}) => {
  return [
    rhelper.accessor("name", {
      header: "Name",
      size: DEFAULT_COL_WIDTH * 2,
      cell: (info) => {
        return (
          <span
            onClick={() => {
              onRuleClick(info.row.original);
            }}
            className={styles["rule-name"]}
          >
            {info.getValue()}
          </span>
        );
      },
    }),
  ];
};
