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
  arrow = false,
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
      PopperProps={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -5],
            },
          },
        ],
      }}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipX;
