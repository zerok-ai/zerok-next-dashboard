import { Table, flexRender } from "@tanstack/react-table";
import cx from 'classnames';
import styles from "./TableX.module.scss";
import { DEFAULT_COL_WIDTH } from "utils/constants";

interface TableXProps<T extends object> {
 table: Table<T>;
}

const TableX = <T extends object>({table}:TableXProps<T>) => {
  return (
    <div className="table">
      <table className={cx("table")}>
        <thead className={cx("table-thead")}>
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
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className={cx("table-body-tr table-tr")}>
                {row.getVisibleCells().map((cell) => (
                  <td className={cx("table-td table-body-td")} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableX;
