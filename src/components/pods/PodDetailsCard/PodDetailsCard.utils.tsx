import { MenuItem, Select } from "@mui/material";
import ZkChartTooltip from "components/charts/ZkChartTooltip";
import CustomSkeleton from "components/custom/CustomSkeleton";
import EmptyChart from "components/EmptyChart";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
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
import {
  type ContainerInfoType,
  type PodDetailResponseType,
  type PodInfoType,
} from "utils/pods/types";
import { type GenericObject } from "utils/types";

import styles from "./PodDetailsCard.module.scss";

export const POD_TABS = [
  {
    label: "Metadata",
    value: "pod-metadata",
  },
  {
    label: "Metrics",
    value: "pod-metrics",
  },
  {
    label: "Containers",
    value: "pod-containers",
  },
];

export const POD_METADATA = "pod-metadata";
export const POD_METRICS = "pod-metrics";
export const POD_CONTAINERS = "pod-containers";

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
  if (!pod || Object.keys(pod).length === 0) {
    return <p>No info found.</p>;
  }
  const keys = Object.keys(pod);
  return (
    <div className={styles["pod-metadata"]}>
      {keys.map((k) => {
        // @ts-expect-error annoying
        const value = pod[k];
        return (
          <div className={styles["pod-metadata-row"]} key={k}>
            <p className={styles["pod-metadata-key"]}>{k}:</p>
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
  pod: PodDetailResponseType | null;
  dataKey: "cpu_usage" | "mem_usage";
}) => {
  if (!pod || !pod[dataKey]) {
    return (
      <p>Could not fetch metrics, please try again later or contact support.</p>
    );
  }
  const dataset = pod[dataKey];
  if (Object.keys(dataset).length === 0) {
    return (
      <EmptyChart
        label={dataKey === "cpu_usage" ? "CPU Usage" : "Memory Usage"}
        height={300}
        width={"99%"}
      />
    );
  }
  const getChartData = (): [GenericObject[], string[]] => {
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
      <ResponsiveContainer height={300} width={"99%"}>
        <LineChart data={series} className={styles["line-chart"]}>
          <CartesianGrid
            opacity={1}
            stroke={cssVars.grey900}
            strokeDasharray={"5 5"}
          />
          <XAxis
            dataKey="timestamps"
            // interval={0}
            overflow={"scroll"}
            // scale="point"
            // ticks={series.map((s) => s.timestamps)}
            axisLine={{
              stroke: cssVars.grey600,
            }}
            stroke={cssVars.grey200}
            style={{
              fontSize: "smaller",
            }}
            allowDataOverflow={true}
            tickFormatter={(tick) => {
              return dayjs.unix(tick / 1000).format("HH:mm");
            }}
          ></XAxis>
          <YAxis
            tickCount={5}
            style={{
              fontSize: "smaller",
              color: cssVars.grey900,
            }}
            tickFormatter={(tick) => {
              return dataKey === "cpu_usage"
                ? `${formatCPUUsage(tick)} %`
                : `${getMBfromBytes(tick)} MB`;
            }}
            width={70}
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
      <p>{dataKey === "cpu_usage" ? "CPU Usage" : "Memory Usage"}</p>
    </div>
  );
};

export const ContainerMetadata = ({
  containers,
  initialFetchDone,
}: {
  containers: ContainerInfoType[] | null;
  initialFetchDone: boolean;
}) => {
  const [selectedContainer, setSelectedContainer] = useState<string>("");
  const keys = useMemo(() => {
    return ["container", "container_id", "image", "image_id", "image_spec"];
  }, []);
  useEffect(() => {
    if (containers && containers.length) {
      setSelectedContainer(containers[0].container_id);
    }
  }, [containers]);
  if (!containers && !initialFetchDone) return <CustomSkeleton len={8} />;
  if (
    (!containers && initialFetchDone) ||
    (containers && Object.keys(containers).length === 0 && initialFetchDone)
  ) {
    return <div>No containers found.</div>;
  }

  const renderMetadata = () => {
    const container = containers!.find(
      (c) => c.container_id === selectedContainer
    );
    if (!container) {
      return <CustomSkeleton len={8} />;
    }
    return keys.map((k) => {
      // @ts-expect-error annoying
      const value = container[k];
      return (
        <div className={styles["pod-metadata-row"]} key={k}>
          <p className={styles["pod-metadata-key"]}>{k}:</p>
          <p className={styles["pod-metadata-value"]}>{value}</p>
        </div>
      );
    });
  };
  return (
    <div className={styles["containers-container"]}>
      <Select
        value={selectedContainer}
        className={styles["container-select"]}
        onChange={(e) => {
          if (e.target && e.target.value) {
            setSelectedContainer(e.target.value);
          }
        }}
      >
        {containers ? (
          containers.map((c) => {
            return (
              <MenuItem value={c.container_id} key={c.container_id}>
                {c.container}
              </MenuItem>
            );
          })
        ) : (
          <CustomSkeleton len={5} />
        )}
      </Select>
      <div className={styles["container-metadata"]}>{renderMetadata()}</div>
    </div>
  );
};
