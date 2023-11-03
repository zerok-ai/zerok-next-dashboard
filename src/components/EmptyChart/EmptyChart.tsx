import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import cssVars from "styles/variables.module.scss";

import styles from "./EmptyChart.module.scss";

interface EmptyChartProps {
  label: string;
  height?: number | string;
  width?: number | string;
}

const EmptyChart = ({
  label,
  width = "99%",
  height = "100%",
}: EmptyChartProps) => {
  return (
    <div className={styles.container}>
      <ResponsiveContainer width={width} height={height}>
        <LineChart>
          <CartesianGrid
            opacity={1}
            stroke={cssVars.grey800}
            strokeDasharray={"5 5"}
          />
          <YAxis tickCount={5} width={0} />
          <XAxis tickCount={10} hide={true} />
        </LineChart>
      </ResponsiveContainer>
      <p>{label}</p>
      <p className={styles["empty-text"]}>
        No {label.toLowerCase()} data available at this time.
      </p>
    </div>
  );
};

export default EmptyChart;
