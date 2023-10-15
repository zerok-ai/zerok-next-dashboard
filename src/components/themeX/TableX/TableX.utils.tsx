import { rankItem } from "@tanstack/match-sorter-utils";
import { type FilterFn } from "@tanstack/react-table";
import { BsSortDown, BsSortUp } from "react-icons/bs";

import styles from "./TableX.module.scss";

export const AscSortIcon = () => {
  return <BsSortDown className={styles["sort-icon"]} />;
};

export const DescSortIcon = () => {
  return <BsSortUp className={styles["sort-icon"]} />;
};

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
