import { type TableSortOptions } from "utils/tables/types";

export const PROM_SORT_OPTIONS: TableSortOptions[] = [
  {
    label: "Created last",
    value: "created_at:desc",
    sort: "desc",
  },
  {
    label: "Created first",
    value: "created_at:asc",
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
