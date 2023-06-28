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
  console.log(cssColors);
  const colors: PalettesProps =
    mode === ThemeMode.DARK ? presetDarkPalettes : presetPalettes;

  let greyPrimary = [
    "#ffffff",
    cssColors.gray100,
    cssColors.gray200,
    cssColors.gray300,
    cssColors.gray400,
    cssColors.gray500,
    cssColors.gray600,
    cssColors.gray700,
    cssColors.gray800,
    cssColors.gray900,
    "#000000",
  ];
  let greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
  let greyConstant = ["#fafafb", "#e6ebf1"];

  if (mode === ThemeMode.DARK) {
    greyPrimary = [
      cssColors.gray1000,
      cssColors.gray900,
      // zero-k dark background
      cssColors.backgroundDark,
      cssColors.backgroundDark,
      cssColors.gray1000,
      // text color - gray 50 from figma
      "#9bb4cc",
      "#d9d9d9",
      "#f0f0f0",
      "#f5f5f5",
      "#fafafa",
      "#ffffff",
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
        primary: alpha(paletteColor.grey[900]!, 0.87),
        secondary: alpha(paletteColor.grey[900]!, 0.45),
        disabled: alpha(paletteColor.grey[900]!, 0.1),
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
