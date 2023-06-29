// material-ui
import { Theme } from '@mui/material/styles';
import css from "styles/variables.module.scss";

// ==============================|| OVERRIDES - INPUT LABEL ||============================== //

export default function InputLabel(theme: Theme) {
  console.log(css.inputLabelLineHeight);
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: css.grey100,
          lineHeight: css.inputLabelLineHeight,
          paddingBottom: css.spXS,
        },
        outlined: {
          // unused below
          "&.MuiInputLabel-sizeSmall": {
            lineHeight: "2rem",
          },
          "&.MuiInputLabel-shrink": {
            background: theme.palette.background.paper,
            padding: "0 8px",
            marginLeft: -6,
            lineHeight: "1.4375em",
          },
        },
      },
    },
  };
}
