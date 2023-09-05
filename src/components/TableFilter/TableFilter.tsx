import { MenuItem, Select } from "@mui/material";
import { type TableSortOptions } from "utils/tables/types";

import styles from "./TableFilter.module.scss";

interface TableFilterProps {
  options: TableSortOptions[];
  value: string;
  onChange: (value: string) => void;
}

const TableFilter = ({ options, value, onChange }: TableFilterProps) => {
  return (
    <div className={styles.container}>
      <Select
        value={value}
        onChange={(e) => {
          if (e.target && e.target.value) {
            onChange(e.target.value);
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
