// material-ui
// assets
import { CheckSquareFilled, MinusSquareFilled } from "@ant-design/icons";
import { Box, type CheckboxProps } from "@mui/material";
import { type Theme } from "@mui/material/styles";
import cssVars from "styles/variables.module.scss";
// types
import { type ExtendedStyleProps } from "types/extended";
// project import
import getColors from "utils/mantis/getColors";

// ==============================|| RADIO - COLORS ||============================== //

function getColorStyle({ color, theme }: ExtendedStyleProps) {
  const colors = getColors(theme, color);
  const { main } = colors;

  return {
    "&:hover": {
      backgroundColor: "transparent",
      "& .icon": {
        borderColor: main,
      },
    },
    "&.Mui-focusVisible": {
      outline: `none`,
      outlineOffset: -4,
    },
  };
}

// ==============================|| CHECKBOX - SIZE STYLE ||============================== //

interface CheckboxSizeProps {
  size: number;
  fontSize: number;
  position: number;
}

function getSizeStyle(size?: CheckboxProps["size"]): CheckboxSizeProps {
  switch (size) {
    case "small":
      return { size: 16, fontSize: 1, position: 1 };
    case "large":
      return { size: 24, fontSize: 1.6, position: 2 };
    case "medium":
    default:
      return { size: 20, fontSize: 1.35, position: 2 };
  }
}

// ==============================|| CHECKBOX - STYLE ||============================== //

function checkboxStyle(size?: CheckboxProps["size"]) {
  const sizes: CheckboxSizeProps = getSizeStyle(size);

  return {
    "& .icon": {
      width: sizes.size,
      height: sizes.size,
      "& .filled": {
        fontSize: `${sizes.fontSize}rem`,
        top: -sizes.position,
        left: -sizes.position,
      },
    },
  };
}

// ==============================|| OVERRIDES - CHECKBOX ||============================== //

export default function Checkbox(theme: Theme) {
  const { palette } = theme;

  return {
    MuiCheckbox: {
      defaultProps: {
        className: "size-small",
        icon: (
          <Box
            className="icon"
            sx={{
              width: 32,
              height: 32,
              border: `1px solid`,
              borderColor: "inherit",
              borderRadius: 0.25,
            }}
          />
        ),
        checkedIcon: (
          <Box
            className="icon"
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.25,
              position: "relative",
            }}
          >
            <CheckSquareFilled
              className="filled"
              style={{
                width: 16,
                height: 16,
                position: "absolute",
                marginTop: 2,
                backgroundColor: `#fff`,
                border: "none",
              }}
            />
          </Box>
        ),
        indeterminateIcon: (
          <Box
            className="icon"
            sx={{
              width: 16,
              height: 16,
              border: "1px solid",
              borderRadius: 0.25,
              position: "relative",
            }}
          >
            <MinusSquareFilled
              className="filled"
              style={{ position: "absolute" }}
            />
          </Box>
        ),
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          color: palette.secondary[300],
          "&.size-small": {
            ...checkboxStyle("small"),
          },
          "&.size-medium": {
            ...checkboxStyle("medium"),
          },
          "&.size-large": {
            ...checkboxStyle("large"),
          },
        },
        colorPrimary: cssVars.primary500,
        colorSecondary: getColorStyle({ color: "secondary", theme }),
        colorSuccess: getColorStyle({ color: "success", theme }),
        colorWarning: getColorStyle({ color: "warning", theme }),
        colorInfo: getColorStyle({ color: "info", theme }),
        colorError: getColorStyle({ color: "error", theme }),
      },
    },
  };
}
