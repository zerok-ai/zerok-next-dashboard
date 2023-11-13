/* eslint-disable @typescript-eslint/dot-notation */
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import cx from "classnames";
import CustomSkeleton from "components/custom/CustomSkeleton";

import styles from "./TableX.module.scss";

interface TableXProps<T extends object> {
  data: T[] | null;
  columns: Array<ColumnDef<T, any>>;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  sortBy?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  onRowClick?: (row: T) => void;
  borderRadius?: boolean;
  skeletonCount?: number;
  noDataMessage?: string;
}

const TableX = <T extends object>({
  data,
  columns,
  headerClassName,
  rowClassName,
  onRowClick,
  sortBy,
  onSortingChange,
  bodyClassName,
  borderRadius = true,
  skeletonCount = 10,
  noDataMessage = "No data",
}: TableXProps<T>) => {
  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: sortBy,
    },
  });
  if (!data) {
    return <CustomSkeleton len={skeletonCount} />;
  }
  return (
    <div className={`table ${borderRadius ? `table-w-br` : ``}`}>
      <table className={cx(styles.table)}>
        <thead className={cx("table-thead", headerClassName)}>
          {table.getHeaderGroups().map((gr) => {
            return (
              <tr key={gr.id}>
                {gr.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className={cx("table-th")}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      <div className={cx(styles["th-content"], "table-th")}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody className={cx(bodyClassName)}>
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
                      style={{
                        width: cell.column.getSize(),
                      }}
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
              <td className={styles["no-data"]}>{noDataMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableX;
