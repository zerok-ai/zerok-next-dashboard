// material-ui
import { Theme } from "@mui/material/styles";
import { ColorProps } from "types/extended";

// project import
import getColors from "utils/mantis/getColors";
import getShadow from "utils/mantis/getShadow";

import css from "styles/variables.module.scss";
import { SPACE_TOKEN } from "utils/constants";
interface Props {
  variant: ColorProps;
  theme: Theme;
}

// ==============================|| OVERRIDES - INPUT BORDER & SHADOWS ||============================== //

function getColor({ variant, theme }: Props) {
  const colors = getColors(theme, variant);
  const { light } = colors;

  const shadows = getShadow(theme, `${variant}`);

  return {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: light,
    },
    "&.Mui-focused": {
      boxShadow: shadows,
      "& .MuiOutlinedInput-notchedOutline": {
        border: `1px solid ${light}`,
      },
    },
  };
}

// ==============================|| OVERRIDES - OUTLINED INPUT ||============================== //

export default function OutlinedInput(theme: Theme) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: `${SPACE_TOKEN * 2}px ${SPACE_TOKEN * 3}px`,
          lineHeight: css.defaultLineHeight,
          height: "auto",
        },
        notchedOutline: {
          borderColor: css.grey600,
        },
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: css.grey50,
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              border: `1px solid ${css.grey50}`,
            },
          },
          "&.Mui-error": {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: css.error500,
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                border: `1px solid ${css.error500}`,
              },
            },
          },
        },
        inputSizeSmall: {
          padding: "7.5px 8px 7.5px 12px",
        },
        inputMultiline: {
          padding: 0,
        },
        colorSecondary: getColor({ variant: "secondary", theme }),
        colorError: getColor({ variant: "error", theme }),
        colorWarning: getColor({ variant: "warning", theme }),
        colorInfo: getColor({ variant: "info", theme }),
        colorSuccess: getColor({ variant: "success", theme }),
      },
    },
  };
}
