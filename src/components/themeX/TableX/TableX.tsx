import { flexRender, type Table } from "@tanstack/react-table";
import cx from "classnames";
import { DEFAULT_COL_WIDTH } from "utils/constants";

import styles from "./TableX.module.scss";

interface TableXProps<T extends object> {
  table: Table<T>;
  data: T[];
  loading?: boolean;
  headerClassName?: string;
  rowClassName?: string;
  onRowClick?: (row: T) => void;
}

const TableX = <T extends object>({
  table,
  data,
  headerClassName,
  rowClassName,
  onRowClick,
}: TableXProps<T>) => {
  return (
    <div className="table">
      <table className={cx("table")}>
        <thead className={cx("table-thead", headerClassName)}>
          {table.getHeaderGroups().map((gr) => {
            return (
              <tr key={gr.id}>
                {gr.headers.map((header) => {
                  const width = header.getSize() || DEFAULT_COL_WIDTH;

                  return (
                    <th
                      key={header.id}
                      className={cx("table-th")}
                      style={{
                        width: `${width}px`,
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                    <td className={cx("table-td table-body-td")} key={cell.id}>
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
