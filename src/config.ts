// types
import {
  type DefaultConfigProps,
  MenuOrientation,
  ThemeDirection,
  ThemeMode,
} from "types/config";

// ==============================|| THEME CONSTANT  ||============================== //

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';

export const APP_DEFAULT_PATH = '/dashboard/analytics';
export const HORIZONTAL_MAX_ITEM = 6;
export const DRAWER_WIDTH = 260;

// ==============================|| THEME CONFIG  ||============================== //

const config: DefaultConfigProps = {
  fontFamily: `'Noto Sans', sans-serif`,
  i18n: "en",
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  container: true,
  mode: ThemeMode.DARK,
  presetColor: "default",
  themeDirection: ThemeDirection.LTR,
};

export default config;
