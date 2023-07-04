import { ICONS } from "./images";
import { DrawerNavItemType } from "./types";

export const NAV_LINKS_1: DrawerNavItemType[] = [
  {
    icon: `${ICONS["chart-up"]}`,
    label: "Health",
    path: "/",
  },
  {
    icon: `${ICONS.puzzle}`,
    label: "Incidents",
    path: "/incidents",
  },
  {
    icon: `${ICONS.plate}`,
    label: "Live Traces",
    path: "/api-keys",
  },
  {
    icon: `${ICONS.code}`,
    label: "Raw Traces",
    path: "/raw-traces",
  },
];

export const NAV_LINKS_2: DrawerNavItemType[] = [
  {
    icon: `${ICONS["data"]}`,
    label: "API Catalog",
    path: "/api-catalog",
  },
  {
    icon: `${ICONS.dashboard}`,
    label: "Custom Dashboard",
    path: "/custom-dashboard",
  },
  {
    icon: `${ICONS.bell}`,
    label: "Alerts",
    path: "/alerts",
  },
];
