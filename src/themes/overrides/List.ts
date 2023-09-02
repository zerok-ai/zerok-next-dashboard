// material-ui
import { type Theme } from "@mui/material/styles";
import css from "styles/variables.module.scss";

// ==============================|| OVERRIDES - INPUT LABEL ||============================== //

export default function List(theme: Theme) {
  return {
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: css.grey925,
          "&.Mui-disabled": {
            color: "red",
          },
          "&.Mui-selected": {
            backgroundColor: css.gray800,
          },
        },
      },
    },
  };
}
