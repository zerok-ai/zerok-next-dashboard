import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { type TooltipProps } from "recharts";
import { formatCPUUsage, getMBfromBytes } from "utils/charts/functions";

import styles from "./ZkChartTooltip.module.scss";

interface ZkChartTooltipProps extends TooltipProps<number, string> {
  type: "cpu" | "memory";
}

const TITLES = {
  cpu: "CPU Usage",
  memory: "Memory Usage",
};

const FORMATTER = {
  cpu: (value: number) => `${formatCPUUsage(value)}%`,
  memory: (value: number) => `${getMBfromBytes(value)} MB`,
};

const ZkChartTooltip = ({
  active,
  payload,
  label,
  type,
}: ZkChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles["custom-tooltip"]}>
        <p className={styles.label}>
          {TITLES[type]} -{" "}
          {dayjs.unix(label / 1000).format("MMM DD hh:mm:ss A")}
        </p>
        <ul className={styles["tooltip-list"]}>
          {payload.map((p) => {
            return (
              <li className={styles["tooltip-list-item"]} key={nanoid()}>
                <span
                  className={styles["tooltip-list-item-label"]}
                  style={{ color: p.stroke }}
                >
                  {p.dataKey}:
                </span>
                <span className={styles["tooltip-list-item-value"]}>
                  {p.value && FORMATTER[type](p.value)}
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
