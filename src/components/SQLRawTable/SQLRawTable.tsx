import { decodeLengthEncodedHexString } from "utils/functions";
import styles from "./SQLRawTable.module.scss";
import { nanoid } from "nanoid";
interface SQLRawTableProps {
  value: string;
}
const SQLRawTable = ({ value }: SQLRawTableProps) => {
  // remove resultset rows string from the start
  const dataWithoutLabel = value.substr(17);
  // splitting on delimiter
  const rows = dataWithoutLabel.split(" | ");
  return (
    <table className={styles["container"]}>
      <tbody>
        {rows.map((row) => {
          const items = decodeLengthEncodedHexString(row);
          return (
            <tr>
              {items.map((it) => {
                return <td key={nanoid()}>{it}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SQLRawTable;
