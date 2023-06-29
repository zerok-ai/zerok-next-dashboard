// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - INPUT LABEL ||============================== //

export default function InputLabel(theme: Theme) {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[600],
        },
        outlined: {
          lineHeight: "2.4rem",
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
