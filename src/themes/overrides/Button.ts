// material-ui
import { alpha, type Theme } from "@mui/material/styles";
// custom cssvars
import cssVars from "styles/variables.module.scss";
// types
import {
  type ButtonVariantProps,
  type ExtendedStyleProps,
} from "types/extended";
import { SPACE_TOKEN } from "utils/constants";
// project import
import getColors from "utils/mantis/getColors";
import getShadow from "utils/mantis/getShadow";

// ==============================|| BUTTON - COLORS ||============================== //

interface ButtonStyleProps extends ExtendedStyleProps {
  variant: ButtonVariantProps;
}

function getColorStyle({ variant, color, theme }: ButtonStyleProps) {
  const colors = getColors(theme, color);
  const { lighter, main, dark, contrastText } = colors;

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const buttonShadow = `${color}Button`;
  const shadows = getShadow(theme, buttonShadow);

  const commonShadow = {
    "&::after": {
      boxShadow: `0 0 5px 5px ${alpha(main, 0.9)}`,
    },
    "&:active::after": {
      boxShadow: `0 0 0 0 ${alpha(main, 0.9)}`,
    },
    "&:focus-visible": {
      outline: `2px solid ${dark}`,
      outlineOffset: 2,
    },
  };

  switch (variant) {
    case "contained":
      return {
        "&:hover": {
          backgroundColor: dark,
        },
        ...commonShadow,
      };
    case "shadow":
      return {
        color: contrastText,
        backgroundColor: main,
        boxShadow: shadows,
        "&:hover": {
          boxShadow: "none",
          backgroundColor: dark,
        },
        ...commonShadow,
      };
    case "outlined":
      return {
        borderColor: main,
        "&:hover": {
          color: dark,
          backgroundColor: "transparent",
          borderColor: dark,
        },
        ...commonShadow,
      };
    case "dashed":
      return {
        color: main,
        borderColor: main,
        backgroundColor: lighter,
        "&:hover": {
          color: dark,
          borderColor: dark,
        },
        ...commonShadow,
      };
    case "text":
      return {
        "&:hover": {
          backgroundColor: cssVars.grey800,
        },
      };
    default:
      return {
        "&:hover": {
          color: dark,
          backgroundColor: lighter,
        },
        ...commonShadow,
      };
  }
}

// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme: Theme) {
  const primaryDashed = getColorStyle({
    variant: "dashed",
    color: "primary",
    theme,
  });
  const primaryShadow = getColorStyle({
    variant: "shadow",
    color: "primary",
    theme,
  });

  const disabledStyle = {
    "&.Mui-disabled": {
      backgroundColor: cssVars.grey600,
      borderColor: cssVars.grey600,
      color: cssVars.grey300,
    },
  };
  const iconStyle = {
    "&>*:nth-of-type(1)": {
      fontSize: "inherit",
    },
  };
  const secondaryContainedButtonOverrides = {
    backgroundColor: cssVars.grey900,
    border: `1px solid ${cssVars.grey600}`,
    color: cssVars.grey25,
    boxShadow: `0px 2px 0px 0px rgba(0, 0, 0, 0.02)`,
  };

  const secondaryOutlineButtonOverrides = {
    backgroundColor: "transparent",
    border: `1px solid ${cssVars.grey600}`,
    color: cssVars.grey25,
    boxShadow: `0px 2px 0px 0px rgba(0, 0, 0, 0.02)`,
    "&:hover": {
      borderColor: cssVars.primary500,
      color: cssVars.primary500,
    },
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
          lineHeight: cssVars.defaultLineHeight,
          "&::after": {
            content: '""',
            display: "block",
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            borderRadius: 4,
            opacity: 0,
            transition: "all 0.5s",
          },

          "&:active::after": {
            position: "absolute",
            borderRadius: 4,
            left: 0,
            top: 0,
            opacity: 1,
            transition: "0s",
          },
        },
        contained: {
          ...disabledStyle,
        },
        outlined: {
          ...disabledStyle,
        },
        text: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        endIcon: {
          ...iconStyle,
        },
        startIcon: {
          ...iconStyle,
        },
        dashed: {
          border: "1px dashed",
          ...primaryDashed,
          "&.MuiButton-dashedPrimary": getColorStyle({
            variant: "dashed",
            color: "primary",
            theme,
          }),
          "&.MuiButton-dashedSecondary": getColorStyle({
            variant: "dashed",
            color: "secondary",
            theme,
          }),
          "&.MuiButton-dashedError": getColorStyle({
            variant: "dashed",
            color: "error",
            theme,
          }),
          "&.MuiButton-dashedSuccess": getColorStyle({
            variant: "dashed",
            color: "success",
            theme,
          }),
          "&.MuiButton-dashedInfo": getColorStyle({
            variant: "dashed",
            color: "info",
            theme,
          }),
          "&.MuiButton-dashedWarning": getColorStyle({
            variant: "dashed",
            color: "warning",
            theme,
          }),
          "&.Mui-disabled": {
            color: `${theme.palette.grey[300]} !important`,
            borderColor: `${theme.palette.grey[400]} !important`,
            backgroundColor: `${theme.palette.grey[200]} !important`,
          },
        },
        shadow: {
          ...primaryShadow,
          "&.MuiButton-shadowPrimary": getColorStyle({
            variant: "shadow",
            color: "primary",
            theme,
          }),
          "&.MuiButton-shadowSecondary": getColorStyle({
            variant: "shadow",
            color: "secondary",
            theme,
          }),
          "&.MuiButton-shadowError": getColorStyle({
            variant: "shadow",
            color: "error",
            theme,
          }),
          "&.MuiButton-shadowSuccess": getColorStyle({
            variant: "shadow",
            color: "success",
            theme,
          }),
          "&.MuiButton-shadowInfo": getColorStyle({
            variant: "shadow",
            color: "info",
            theme,
          }),
          "&.MuiButton-shadowWarning": getColorStyle({
            variant: "shadow",
            color: "warning",
            theme,
          }),
          "&.Mui-disabled": {
            color: `${theme.palette.grey[300]} !important`,
            borderColor: `${theme.palette.grey[400]} !important`,
            backgroundColor: `${theme.palette.grey[200]} !important`,
          },
        },
        containedPrimary: getColorStyle({
          variant: "contained",
          color: "primary",
          theme,
        }),
        containedSecondary: {
          ...getColorStyle({
            variant: "contained",
            color: "secondary",
            theme,
          }),
          ...secondaryContainedButtonOverrides,
        },
        containedError: getColorStyle({
          variant: "contained",
          color: "error",
          theme,
        }),
        containedSuccess: getColorStyle({
          variant: "contained",
          color: "success",
          theme,
        }),
        containedInfo: getColorStyle({
          variant: "contained",
          color: "info",
          theme,
        }),
        containedWarning: getColorStyle({
          variant: "contained",
          color: "warning",
          theme,
        }),
        outlinedPrimary: getColorStyle({
          variant: "outlined",
          color: "primary",
          theme,
        }),
        outlinedSecondary: {
          ...getColorStyle({
            variant: "outlined",
            color: "secondary",
            theme,
          }),
          ...secondaryOutlineButtonOverrides,
        },
        outlinedError: getColorStyle({
          variant: "outlined",
          color: "error",
          theme,
        }),
        outlinedSuccess: getColorStyle({
          variant: "outlined",
          color: "success",
          theme,
        }),
        outlinedInfo: getColorStyle({
          variant: "outlined",
          color: "info",
          theme,
        }),
        outlinedWarning: getColorStyle({
          variant: "outlined",
          color: "warning",
          theme,
        }),
        textPrimary: getColorStyle({
          variant: "text",
          color: "primary",
          theme,
        }),
        textSecondary: getColorStyle({
          variant: "text",
          color: "secondary",
          theme,
        }),
        textError: getColorStyle({ variant: "text", color: "error", theme }),
        textSuccess: getColorStyle({
          variant: "text",
          color: "success",
          theme,
        }),
        textInfo: getColorStyle({ variant: "text", color: "info", theme }),
        textWarning: getColorStyle({
          variant: "text",
          color: "warning",
          theme,
        }),
        sizeExtraSmall: {
          minWidth: 56,
          fontSize: "0.625rem",
          padding: "2px 8px",
        },
        sizeMedium: {
          height: cssVars.buttonHeightDefault,
          padding: `${2 * SPACE_TOKEN}px ${4 * SPACE_TOKEN}px`,
        },
      },
    },
  };
}
