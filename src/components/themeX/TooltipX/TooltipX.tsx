import { Tooltip } from "@mui/material";
import { type ReactNode } from "react";

import styles from "./TooltipX.module.scss";

interface TooltipXProps {
  placement?: "top" | "bottom" | "left" | "right";
  arrow?: boolean;
  title: string;
  children: ReactNode;
}

const TooltipX = ({
  placement = "top",
  arrow = true,
  title,
  children,
}: TooltipXProps) => {
  return (
    <Tooltip placement={placement} arrow={arrow} title={title}>
      {children}
    </Tooltip>
  );
};

export default TooltipX;
