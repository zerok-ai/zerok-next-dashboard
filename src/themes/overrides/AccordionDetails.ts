// material-ui
import { type Theme } from "@mui/material/styles";
import css from "styles/variables.module.scss";

// ==============================|| OVERRIDES - ALERT TITLE ||============================== //

export default function AccordionDetails(theme: Theme) {
  return {
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          // padding: theme.spacing(2),
          borderTop: `1px solid ${css.grey800}`,
        },
      },
    },
  };
}
