import { useState, useEffect } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";

// third-party
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// project import
import useConfig from "hooks/useConfig";
import { GenericObject } from "utils/types";

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: "area",
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  grid: {
    strokeDashArray: 0,
  },
};

// ==============================|| INCOME AREA CHART ||============================== //

interface Props {
  series: {
    name: string;
    data: number[];
  }[];
  timeStamps: string[];
}

const TimeSeriesChart = ({ series, timeStamps }: Props) => {
  const theme = useTheme();
  const { mode } = useConfig();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState<GenericObject>(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      noData: {
        text: "Loading...",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
        style: {
          color: mode === "dark" ? "#FFFFFF" : "#000000",
          fontSize: "14px",
          fontFamily: "Helvetica",
        },
      },
      xaxis: {
        categories: timeStamps,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary],
          },
        },
      },
      grid: {
        borderColor: line,
      },
      tooltip: {
        theme: mode === "dark" ? "dark" : "light",
      },
    }));
  }, [mode, primary, secondary, line, theme, series, timeStamps]);

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={450}
    />
  );
};

export default TimeSeriesChart;
