/* eslint-disable */
import { type ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import cssVars from "styles/variables.module.scss";
import { type PodDetailResponseType } from "utils/pods/types";

import styles from "./PodDetailsCard.module.scss";

const ReactApexChart = dynamic(async () => await import("react-apexcharts"), {
  ssr: false,
});

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
        // @ts-ignore
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
  console.log({ pod, dataKey });
  const getSeries = () => {
    const data = pod[dataKey];
    console.log({ data }, dataKey);
    return data.frames.map((frame) => {
      return {
        name: frame.schema.name,
        data: frame.data.values,
      };
    });
  };
  const series = getSeries();
  const timestamps: string[] = [];
  pod.cpuUsage.frames.map((fr) => {
    fr.data.timeStamp.map((ts) => {
      console.log(dayjs.unix(ts / 1000).format("DD/MM/YY HH:mm:ss"));
      timestamps.push(dayjs.unix(ts / 1000).toISOString());
      return true;
    });
    return true;
  });
  const options: ApexOptions = {
    theme: {
      mode: "dark",
    },
    chart: {
      height: 350,
      type: "area",
      background: cssVars["dark-bg"],
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: true,
      borderColor: "#000",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      categories: timestamps,
    },
  };

  return <ReactApexChart series={series} options={options} height="350px" />;
};
