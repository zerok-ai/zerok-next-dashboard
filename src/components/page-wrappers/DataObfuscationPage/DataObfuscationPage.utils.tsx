import { createColumnHelper } from "@tanstack/react-table";
import TableActions from "components/helpers/TableActions";
import { DEFAULT_COL_WIDTH } from "utils/constants";
import {
  type DefaultRegexRuleType,
  type ObfuscationRuleType,
} from "utils/data/types";
import { getFormattedTime } from "utils/dateHelpers";
import { type TableActionPropType } from "utils/tables/types";

import styles from "./DataObfuscationPage.module.scss";

export const getObfuscationColumns = ({
  actions,
}: {
  actions: TableActionPropType<ObfuscationRuleType>;
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
