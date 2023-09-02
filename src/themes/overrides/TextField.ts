// material-ui
import { type Theme } from "@mui/material/styles";

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
