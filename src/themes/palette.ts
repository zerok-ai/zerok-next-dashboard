// material-ui
import { type Theme } from "@mui/material";
import {
  alpha,
  createTheme,
  type PaletteColorOptions,
} from "@mui/material/styles";
import { type PresetColor, type ThemeMode } from "types/config";
// types
import { type PaletteThemeProps } from "types/theme";

// colors
import cssColors from "../styles/variables.module.scss";

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode: ThemeMode, presetColor: PresetColor): Theme => {
  const greyColors: PaletteColorOptions = {
    0: cssColors.grey25,
    50: cssColors.grey50,
    100: cssColors.grey100,
    200: cssColors.grey200,
    300: cssColors.grey300,
    400: cssColors.grey400,
    500: cssColors.grey500,
    600: cssColors.grey600,
    700: cssColors.grey700,
    800: cssColors.grey800,
    900: cssColors.grey900,
    A50: cssColors.backgroundDark,
    A100: cssColors.grey100,
    A200: cssColors.grey200,
    A400: cssColors.grey400,
    A700: cssColors.grey700,
    A800: cssColors.grey200,
  };

  const contrastText = "#fff";
  const infoColors = ["#E0F4F5", "#26B0BA", "#00A2AE", "#009AA7", "#008694"];

  const paletteColor: PaletteThemeProps = {
    primary: {
      lighter: cssColors.primary100,
      100: cssColors.primary100,
      200: cssColors.primary200,
      light: cssColors.primary300,
      400: cssColors.primary400,
      main: cssColors.primary500,
      dark: cssColors.primary600,
      700: cssColors.primary600,
      darker: cssColors.primary700,
      900: cssColors.primary800,
      contrastText,
    },
    secondary: {
      lighter: greyColors[100],
      100: greyColors[100],
      200: greyColors[200],
      light: greyColors[300],
      400: greyColors[400],
      main: greyColors[500]!,
      600: greyColors[600],
      dark: greyColors[700],
      800: greyColors[800],
      darker: greyColors[900],
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: greyColors[0],
    },
    error: {
      lighter: cssColors.error100,
      light: cssColors.error300,
      main: cssColors.error500,
      dark: cssColors.error700,
      darker: cssColors.error900,
      contrastText,
    },
    warning: {
      lighter: cssColors.warning100,
      light: cssColors.warning300,
      main: cssColors.warning500,
      dark: cssColors.warning700,
      darker: cssColors.warning900,
      contrastText: greyColors[100],
    },
    info: {
      lighter: infoColors[0],
      light: infoColors[1],
      main: infoColors[2],
      dark: infoColors[3],
      darker: infoColors[4],
      contrastText,
    },
    success: {
      lighter: cssColors.success100,
      light: cssColors.success300,
      main: cssColors.success500,
      dark: cssColors.success700,
      darker: cssColors.success900,
      contrastText,
    },
    grey: greyColors,
  };
  const returnTheme = createTheme({
    palette: {
      mode,
      common: {
        black: cssColors.black,
        white: cssColors.white,
      },
      ...paletteColor,
      text: {
        primary: cssColors.grey300,
        secondary: cssColors.grey300,
        disabled: cssColors.grey600,
      },
      action: {
        disabled: paletteColor.grey[300],
      },
      divider: alpha(paletteColor.grey[900]!, 0.05),
      background: {
        paper: cssColors.backgroundDark,
        default: paletteColor.grey.A50,
      },
    },
  });
  return returnTheme;
};

export default Palette;
