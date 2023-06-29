// ==============================|| OVERRIDES - INPUT BASE ||============================== //
import css from "styles/variables.module.scss";
export default function InputBase() {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          sizeSmall: {
            fontSize: "0.75rem",
          },
          input: {
            color: css.grey50,
            "&::placeholder": {
              color: css.grey300,
            },
          },
        },
      },
    },
  };
}
