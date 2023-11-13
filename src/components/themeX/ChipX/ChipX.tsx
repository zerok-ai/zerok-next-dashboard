import cx from "classnames";
import React from "react";

import styles from "./ChipX.module.scss";

interface ChipXProps {
  label: string | React.ReactNode;
  upperCase?: boolean;
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "warning"
    | "default"
    | "disabled";
  size?: "small" | "medium";
}

const ChipX = ({
  label,
  upperCase = true,
  color = "default",
  size = "medium",
}: ChipXProps) => {
  return (
    <div
      className={cx(
        styles.container,
        upperCase && styles.upper,
        styles[color],
        size === "small" && styles.small
      )}
    >
      {label}
    </div>
  );
};

export default ChipX;
