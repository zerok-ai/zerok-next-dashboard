import { Tooltip } from "@mui/material";

interface TooltipXProps {
  placement?: "top" | "bottom" | "left" | "right";
  arrow?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactElement;
}

const TooltipX = ({
  placement = "top",
  arrow = true,
  title,
  children,
  disabled = false,
}: TooltipXProps) => {
  if (disabled) {
    return children;
  }
  return (
    <Tooltip
      disableFocusListener={!!disabled}
      placement={placement}
      arrow={arrow}
      title={title}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipX;
