import { flexRender, type Table } from "@tanstack/react-table";
import cx from "classnames";

import styles from "./TableX.module.scss";

interface TableXProps<T extends object> {
  table: Table<T>;
  data: T[];
  loading?: boolean;
  headerClassName?: string;
  rowClassName?: string;
  borderRadius?: boolean;
  onRowClick?: (row: T) => void;
}

const TableX = <T extends object>({
  table,
  data,
  headerClassName,
  rowClassName,
  onRowClick,
  borderRadius = true,
}: TableXProps<T>) => {
  return (
    <div className={`table ${borderRadius ? `table-w-br` : ``}`}>
      <table className={cx(styles.table)}>
        <thead className={cx("table-thead", headerClassName)}>
          {table.getHeaderGroups().map((gr) => {
            return (
              <tr key={gr.id}>
                {gr.headers.map((header) => {
                  const width = header.getSize();
                  console.log({ width });
                  return (
                    <th
                      key={header.id}
                      className={cx("table-th")}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
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
