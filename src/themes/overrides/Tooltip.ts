// material-ui
import { Theme } from '@mui/material/styles';
import cssVars from "styles/variables.module.scss";

// ==============================|| OVERRIDES - TOOLTIP ||============================== //

export default function Tooltip(theme: Theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: cssVars.grey900,
          color: cssVars.grey50,
        },
        arrow: {
          color: cssVars.grey900,
        },
      },
    },
  };
}
