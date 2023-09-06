import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { type TooltipProps } from "recharts";

import styles from "./ZkChartTooltip.module.scss";

const ZkChartTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles["custom-tooltip"]}>
        <p className={styles.label}>
          {dayjs.unix(label / 1000).format("hh:mm:ss A")}
        </p>
        <ul className={styles["tooltip-list"]}>
          {payload.map((p) => {
            return (
              <li className={styles["tooltip-list-item"]} key={nanoid()}>
                <span
                  className={styles["tooltip-list-item-label"]}
                  style={{ color: p.stroke }}
                >
                  {p.payload.name}:
                </span>
                <span className={styles["tooltip-list-item-value"]}>
                  {p.value?.toFixed(5)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  return null;
};

export default ZkChartTooltip;
