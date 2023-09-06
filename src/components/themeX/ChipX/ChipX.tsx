import cx from "classnames";
import React from "react";

import styles from "./ChipX.module.scss";

interface ChipXProps {
  label: string | React.ReactNode;
  upperCase?: boolean;
  color?: "primary" | "secondary" | "error" | "success" | "warning";
}

const ChipX = ({
  label,
  upperCase = true,
  color = "secondary",
}: ChipXProps) => {
  return (
    <div
      className={cx(styles.container, upperCase && styles.upper, styles[color])}
    >
      {label}
    </div>
  );
};

export default ChipX;
