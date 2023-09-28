import { MenuItem, Select } from "@mui/material";
import { type ColumnSort } from "@tanstack/react-table";
import { type TableSortOptions } from "utils/tables/types";

import styles from "./TableFilter.module.scss";

interface TableFilterProps {
  options: TableSortOptions[];
  sortBy: ColumnSort;
  onChange: (value: ColumnSort) => void;
  size?: "small" | "medium";
}

const TableFilter = ({ options, sortBy, onChange, size }: TableFilterProps) => {
  return (
    <div className={styles.container}>
      <Select
        className={styles.select}
        size={size ?? "small"}
        value={`${sortBy.id}:${sortBy.desc ? "desc" : "asc"}`}
        renderValue={(selected) => {
          const label = options.find(
            (option) => option.value === selected
          )?.label;
          return (
            <span className={styles["select-label"]}>
              <span className={styles["select-label-prefix"]}>Sort by</span>{" "}
              {label}
            </span>
          );
        }}
        onChange={(e) => {
          if (e.target && e.target.value) {
            const [id, desc] = e.target.value.split(":");
            onChange({
              id,
              desc: desc === "desc",
            });
          }
        }}
      >
        {options.map((option) => {
          return (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
};

export default TableFilter;
