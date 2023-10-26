// material-ui
import { type Theme } from "@mui/material/styles";
import css from "styles/variables.module.scss";

// ==============================|| OVERRIDES - ALERT TITLE ||============================== //

export default function Accordion(theme: Theme) {
  return {
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        square: true,
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${css.grey800}`,
          backgroundColor: css.bgDark,
          borderRadius: `8px`,
          "&:before": {
            display: "none",
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.secondary.lighter,
          },
        },
      },
    },
  };
}
