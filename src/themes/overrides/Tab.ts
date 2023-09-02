// material-ui
import { type Theme } from "@mui/material/styles";
import cssVars from "styles/variables.module.scss";
import { SPACE_TOKEN } from "utils/constants";

// ==============================|| OVERRIDES - TAB ||============================== //

export default function Tab(theme: Theme) {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 40,
          color: cssVars.grey100,
          marginRight: `${SPACE_TOKEN}px`,
          fontSize: cssVars.fontLG,
          lineHeight: cssVars.defaultLineHeight,
          border: "none",
          borderBottom: `1px solid transparent`,
          padding: `${SPACE_TOKEN * 2}px ${SPACE_TOKEN * 3}px`,
          "&:hover": {
            color: cssVars.white,
            borderBottom: `1px solid ${cssVars.primary500}`,
          },
          "&:focus-visible": {
            color: cssVars.white,
            borderBottom: `1px solid ${cssVars.primary500}`,
          },
          "&.Mui-selected": {
            color: cssVars.white,
            borderBottom: `1px solid ${cssVars.primary500}`,
          },
          "&.MuiTabs-indicator": {},
        },
      },
    },
  };
}
