// material-ui
import { PaletteColorOptions, alpha, createTheme } from "@mui/material/styles";

// third-party
import {
  presetDarkPalettes,
  presetPalettes,
  PalettesProps,
} from "@ant-design/colors";

// types
import { PaletteThemeProps } from "types/theme";
import { PresetColor, ThemeMode } from "types/config";

// colors
import cssColors from "../styles/variables.module.scss";

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode: ThemeMode, presetColor: PresetColor) => {
  const colors: PalettesProps =
    mode === ThemeMode.DARK ? presetDarkPalettes : presetPalettes;

  let greyPrimary = [
    "#ffffff",
    cssColors.grey100,
    cssColors.grey200,
    cssColors.grey300,
    cssColors.grey400,
    cssColors.grey500,
    cssColors.grey600,
    cssColors.grey700,
    cssColors.grey800,
    cssColors.grey900,
    "#000000",
  ];
  let greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
  let greyConstant = ["#fafafb", "#e6ebf1"];

  if (mode === ThemeMode.DARK) {
    greyPrimary = [
      cssColors.white,
      cssColors.grey100,
      "#f5f5f5",
      cssColors.grey500,
      "#d9d9d9",
      "#bfbfbf",
      "#8c8c8c",
      "#595959",
      "#262626",
      "#141414",
      "#000000",
    ];
    // greyPrimary.reverse();
    greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
    greyConstant = [cssColors.backgroundDark, "#d3d8db"];
  }
  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];
  const { grey } = colors;
  const greyColors: PaletteColorOptions = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16],
  };

  const contrastText = "#fff";

  let errorColors = ["#FDE8E7", "#F25E52", "#F04134", "#EE3B2F", "#E92A21"];
  let warningColors = ["#FFF7E0", "#FFC926", "#FFBF00", "#FFB900", "#FFA900"];
  let infoColors = ["#E0F4F5", "#26B0BA", "#00A2AE", "#009AA7", "#008694"];
  let successColors = ["#E0F5EA", "#26B56E", "#00A854", "#00A04D", "#008D3A"];

  const paletteColor: PaletteThemeProps = {
    primary: {
      lighter: "ff00000",
      100: cssColors.primary200,
      200: cssColors.primary300,
      light: cssColors.primary400,
      400: cssColors.primary400,
      main: cssColors.primary400,
      dark: cssColors.primary500,
      700: cssColors.primary500,
      darker: cssColors.primary500,
      900: cssColors.primary600,
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
      lighter: errorColors[0],
      light: errorColors[1],
      main: errorColors[2],
      dark: errorColors[3],
      darker: errorColors[4],
      contrastText,
    },
    warning: {
      lighter: warningColors[0],
      light: warningColors[1],
      main: warningColors[2],
      dark: warningColors[3],
      darker: warningColors[4],
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
      lighter: successColors[0],
      light: successColors[1],
      main: successColors[2],
      dark: successColors[3],
      darker: successColors[4],
      contrastText,
    },
    grey: greyColors,
  };

  return createTheme({
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
};

export default Palette;
