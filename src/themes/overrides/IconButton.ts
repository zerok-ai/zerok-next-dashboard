// material-ui
import { Theme } from "@mui/material/styles";
import cssVars from "styles/variables.module.scss";
import { SPACE_TOKEN } from "utils/constants";

// ==============================|| OVERRIDES - ICON BUTTON ||============================== //

export default function IconButton(theme: Theme) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: cssVars.grey900,
          borderRadius: 4,
          border: `1px solid ${cssVars.grey700}`,
          padding: `${2 * SPACE_TOKEN}px ${3 * SPACE_TOKEN}`,
          "&:hover": {
            backgroundColor: cssVars.grey900,
            border: `1px solid ${cssVars.primary500}`,
          },
        },
        sizeLarge: {
          width: `${10 * SPACE_TOKEN}px`,
          height: `${10 * SPACE_TOKEN}px`,
          fontSize: "1.25rem",
        },
        sizeMedium: {
          width: `${9 * SPACE_TOKEN}px`,
          height: `${9 * SPACE_TOKEN}px`,
          fontSize: "1rem",
        },
        sizeSmall: {
          width: `${6.5 * SPACE_TOKEN}px`,
          height: `${6.5 * SPACE_TOKEN}px`,
          fontSize: "0.75rem",
        },
      },
    },
  };
}
