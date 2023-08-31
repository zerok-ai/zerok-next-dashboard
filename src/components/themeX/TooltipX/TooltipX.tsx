import { Tooltip } from "@mui/material";

interface TooltipXProps {
  placement?: "top" | "bottom" | "left" | "right";
  arrow?: boolean;
  title: string;
  children: React.ReactElement;
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