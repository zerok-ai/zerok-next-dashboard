/* eslint-disable @typescript-eslint/dot-notation */
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import cx from "classnames";
import CustomSkeleton from "components/CustomSkeleton";
import { useState } from "react";

import styles from "./TableX.module.scss";
import { AscSortIcon, DescSortIcon } from "./TableX.utils";

interface TableXProps<T extends object> {
  data: T[] | null;
  columns: Array<ColumnDef<T, any>>;
  headerClassName?: string;
  rowClassName?: string;
  onRowClick?: (row: T) => void;
  borderRadius?: boolean;
}

const TableX = <T extends object>({
  data,
  columns,
  headerClassName,
  rowClassName,
  onRowClick,
  borderRadius = true,
}: TableXProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (!data) {
    return <CustomSkeleton len={10} />;
  }
  return (
    <div className={`table ${borderRadius ? `table-w-br` : ``}`}>
      <table className={cx(styles.table)}>
        <thead className={cx("table-thead", headerClassName)}>
          {table.getHeaderGroups().map((gr) => {
            return (
              <tr key={gr.id}>
                {gr.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const renderSortIcon = () => {
                    if (!isSorted) return null;
                    return isSorted === "desc" ? (
                      <AscSortIcon />
                    ) : (
                      <DescSortIcon />
                    );
                  };
                  return (
                    <th
                      key={header.id}
                      className={cx(
                        "table-th",

                        header.column.getCanSort() ? "cursor-pointer" : ""
                      )}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                      }}
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      <div className={cx(styles["th-content"], "table-th")}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {renderSortIcon()}
                      </div>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {data.length ? (
            table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className={cx("table-body-tr table-tr", rowClassName)}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className={cx("table-td table-body-td")}
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td className={styles["no-data"]}>No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableX;
