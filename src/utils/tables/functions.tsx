import { type ColumnHelper } from "@tanstack/react-table";

import { type TableColumnItems } from "./types";

export const createColumns = <T,>(
  items: Array<TableColumnItems<T>>,
  helper: ColumnHelper<T>
) => {
  return items.map((item) => {
    const {
      header,
      accessor,
      columnType,
      customClassName,
      customRender,
      size,
    } = item;
    if (columnType === "accessor") {
      // @ts-expect-error annoying typescript error
      return helper.accessor(accessor!, {
        Header: header,
        size,
        cell: (info) => {
          return (
            <div className={customClassName}>
              {customRender(info.row.original)}
            </div>
          );
        },
      });
    } else {
      return helper.display({
        id: header,
        size,
        cell: (info) => {
          return (
            <div className={customClassName}>
              {customRender(info.row.original)}
            </div>
          );
        },
      });
    }
  });
};
