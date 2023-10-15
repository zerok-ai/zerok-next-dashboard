import { type TableSortOptions } from "./types";

export const PROBE_SORT_OPTIONS: TableSortOptions[] = [
  {
    label: "Latest first",
    value: "created_at:desc",
    sort: "desc",
  },
  {
    label: "Earliest first",
    value: "created_at:asc",
    sort: "asc",
  },
];
