// material-ui
import { Theme } from "@mui/material/styles";
import css from "styles/variables.module.scss";

// ==============================|| OVERRIDES - INPUT LABEL ||============================== //

export default function TextField(theme: Theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          //   border: `1px solid ${css.grey300}`,
        },
      },
    },
  };
}
