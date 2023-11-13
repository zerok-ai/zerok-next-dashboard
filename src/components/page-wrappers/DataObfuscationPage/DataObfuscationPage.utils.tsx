import { Switch } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import TableActions from "components/helpers/TableActions";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import {
  type DefaultRegexRuleType,
  type ObfuscationRuleType,
} from "utils/data/types";
import { getFormattedTime } from "utils/dateHelpers";
import { type TableActionItem } from "utils/tables/types";

import styles from "./DataObfuscationPage.module.scss";

export const getObfuscationColumns = ({
  onEdit,
  onUpdate,
}: {
  onEdit: (row: ObfuscationRuleType) => void;
  onUpdate: (row: ObfuscationRuleType) => void;
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
        const row = info.row.original;
        const { enabled } = row;
        const actions: TableActionItem[] = [
          {
            element: <span>Edit</span>,
            onClick: () => {
              onEdit(row);
            },
          },
          {
            element: (
              <div className={styles["action-item"]}>
                {enabled ? "Disable" : "Enable"}
                <Switch
                  defaultChecked={enabled}
                  className={styles.switch}
                  size="medium"
                  onChange={() => {
                    onUpdate(row);
                  }}
                />
              </div>
            ),
            onClick: () => {
              onUpdate(row);
            },
          },
        ];
        return <TableActions list={actions} loading={false} />;
      },
    }),
  ];
  return columns;
};

export const data: ObfuscationRuleType[] = [
  {
    name: "test",
    analyzer: {
      pattern: "test",
      type: "regex",
    },
    enabled: true,
    created_by: "test",
    updated_at: "test",
    created_at: "test",
    anonymizer: {
      operator: "replace",
      params: {
        new_value: "test",
      },
    },
  },
  {
    name: "test 2",
    analyzer: {
      pattern: "test",
      type: "regex",
    },
    enabled: true,
    created_by: "test 2",
    updated_at: "test",
    created_at: "test",
    anonymizer: {
      operator: "replace",
      params: {
        new_value: "test 2",
      },
    },
  },
];

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
