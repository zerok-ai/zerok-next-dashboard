import { nanoid } from "nanoid";
import { decodeLengthEncodedHexString } from "utils/functions";

import styles from "./SQLRawTable.module.scss";
interface SQLRawTableProps {
  value: string;
}
const SQLRawTable = ({ value }: SQLRawTableProps) => {
  // remove resultset rows string from the start
  // splitting on delimiter
  const [rowText, values] = value.split(" > ");
  const rowCount = rowText.includes(" = ") ? rowText.split(" = ")[1] : "";
  const rows = values.split(" | ");

  return (
    <div className={styles.container}>
      {rowCount.length && (
        <p>
          <span>{rowCount}</span> rows
        </p>
      )}
      <table className={styles.table}>
        <tbody>
          {rows.map((row) => {
            const items = decodeLengthEncodedHexString(row);
            return (
              <tr key={nanoid()}>
                {items.map((it) => {
                  return <td key={nanoid()}>{it}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SQLRawTable;
