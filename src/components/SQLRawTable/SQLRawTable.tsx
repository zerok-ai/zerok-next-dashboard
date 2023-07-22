import { nanoid } from "nanoid";
import { decodeLengthEncodedHexString } from "utils/functions";

import styles from "./SQLRawTable.module.scss";
interface SQLRawTableProps {
  value: string;
}
const SQLRawTable = ({ value }: SQLRawTableProps) => {
  // remove resultset rows string from the start
  const dataWithoutLabel = value.substr(17);
  // splitting on delimiter
  const rows = dataWithoutLabel.split(" | ");
  console.log({ rows });
  return (
    <table className={styles.container}>
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
  );
};

export default SQLRawTable;
