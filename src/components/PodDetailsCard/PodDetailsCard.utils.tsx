// /* eslint-disable */
import ZkChartTooltip from "components/ZkChartTooltip";
import dayjs from "dayjs";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import cssVars from "styles/variables.module.scss";
import { formatCPUUsage, getMBfromBytes } from "utils/charts/functions";
import { type PodDetailResponseType, type PodInfoType } from "utils/pods/types";
import { type GenericObject } from "utils/types";

import styles from "./PodDetailsCard.module.scss";

export const POD_TABS = [
  {
    label: "Metadata",
    value: "pod-metadata",
  },
  {
    label: "CPU Usage",
    value: "cpu-usage",
  },
  {
    label: "Memory Usage",
    value: "memory-usage",
  },
];

export const POD_METADATA = "pod-metadata";
export const CPU_USAGE = "cpu-usage";
export const MEMORY_USAGE = "memory-usage";

const lineChartColors: string[] = [
  "#8884d8", // Purple-Blue
  "#82ca9d", // Green
  "#8C82D7", // Lavender Blue
  "#FF5733", // Red-Orange
  "#66CDAA", // Medium Aquamarine
  "#FF6B81", // Blush
  "#4169E1", // Royal Blue
  "#FFAA33", // Amber
  "#32CD32", // Lime Green
  "#FF8C94", // Salmon Pink
];

export const PodMetadata = ({ pod }: { pod: PodInfoType }) => {
  if (!pod) return null;
  const keys = Object.keys(pod);
  return (
    <div className={styles["pod-metadata"]}>
      {keys.map((k) => {
        // @ts-expect-error annoying
        const value = pod[k];
        return (
          <div className={styles["pod-metadata-row"]} key={k}>
            <p className={styles["pod-metadata-key"]}>
              {k.split("_").join(" ")}:
            </p>
            <p className={styles["pod-metadata-value"]}>{value}</p>
          </div>
        );
      })}
    </div>
  );
};

export const PodChart = ({
  pod,
  dataKey,
}: {
  pod: PodDetailResponseType;
  dataKey: "cpu_usage" | "mem_usage";
}) => {
  const getChartData = (): [GenericObject[], string[]] => {
    const dataset = pod[dataKey];
    const series: GenericObject[] = [];
    const keys = Object.keys(dataset);
    const timestamps = dataset[keys[0]].time_stamp;
    timestamps.forEach((time, i) => {
      const obj: GenericObject = {
        timestamps: time,
      };
      keys.forEach((key) => {
        obj[key] = dataset[key].values[i];
      });
      series.push(obj);
    });
    return [series, keys];
  };
  const [series, keys] = getChartData();
  return (
    <div className={styles["chart-container"]}>
      <ResponsiveContainer width="90%" height={500}>
        <LineChart data={series} className={styles["line-chart"]}>
          <CartesianGrid opacity={1} stroke={cssVars.grey900} />
          <XAxis
            dataKey="timestamps"
            scale="point"
            axisLine={{
              stroke: cssVars.grey600,
            }}
            stroke={cssVars.grey200}
            style={{
              fontSize: "smaller",
            }}
            tickFormatter={(tick) => {
              return dayjs.unix(tick / 1000).format("HH:mm");
            }}
          />
          <YAxis
            style={{
              fontSize: "smaller",
              color: cssVars.grey900,
            }}
            tickFormatter={(tick) => {
              return dataKey === "cpu_usage"
                ? `${formatCPUUsage(tick)} %`
                : `${getMBfromBytes(tick)} MB`;
            }}
            width={100}
            axisLine={{
              stroke: cssVars.grey600,
            }}
            stroke={cssVars.grey200}
          />
          <Tooltip
            content={
              <ZkChartTooltip
                type={dataKey === `cpu_usage` ? `cpu` : `memory`}
              />
            }
          />
          <Legend />
          {keys.map((line, idx) => {
            let color = lineChartColors[idx];
            if (idx > lineChartColors.length - 1) {
              color = lineChartColors[idx % lineChartColors.length];
            }
            return (
              <Line
                type="monotone"
                dataKey={line}
                name={line}
                key={line}
                stroke={color}
                dot={false}
                activeDot={{ r: 4 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
