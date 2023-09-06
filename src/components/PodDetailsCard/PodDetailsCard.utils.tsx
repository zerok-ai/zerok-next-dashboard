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
import { type PodDetailResponseType } from "utils/pods/types";
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

export const PodMetadata = ({ pod }: { pod: PodDetailResponseType }) => {
  if (!pod) return null;
  const keys = Object.keys(pod.metadata);
  return (
    <div className={styles["pod-metadata"]}>
      {keys.map((k) => {
        // @ts-expect-error annoying
        const value = pod.metadata[k];
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
  dataKey: "cpuUsage" | "memUsage";
}) => {
  const getChartData = () => {
    const dataset = pod[dataKey];
    const series: GenericObject[] = [];
    dataset.frames.map((fr) => {
      const { schema, data } = fr;
      data.values.map((val, idx) => {
        series.push({
          x: data.timeStamp[idx],
          [schema.name]: val,
          name: schema.name,
        });
        return true;
      });
      return true;
    });
    return series;
  };
  const series = getChartData();
  return (
    <div className={styles["chart-container"]}>
      <ResponsiveContainer width="90%" height={500}>
        <LineChart data={series} className={styles["line-chart"]}>
          <CartesianGrid opacity={1} stroke={cssVars.grey900} />
          <XAxis
            dataKey="x"
            scale="time"
            // ticks={getTicks()}
            axisLine={{
              stroke: cssVars.grey600,
            }}
            stroke={cssVars.grey200}
            tickFormatter={(tick) => {
              return dayjs(tick).format("HH:mm");
            }}
          />
          <YAxis
            dataKey="zk-wsp-client"
            axisLine={{
              stroke: cssVars.grey600,
            }}
            stroke={cssVars.grey200}
          />
          <Tooltip content={<ZkChartTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="zk-wsp-client"
            stroke="#8884d8"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
