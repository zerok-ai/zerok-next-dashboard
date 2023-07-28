import { ICONS } from "./images";
import { type DrawerNavItemType } from "./types";

export const NAV_LINKS_1: DrawerNavItemType[] = [
  {
    icon: `${ICONS["chart-up"]}`,
    label: "Health",
    path: "/",
  },
  // {
  //   icon: `${ICONS.plate}`,
  //   label: "Classify",
  //   path: "/classify",
  // },
  {
    icon: `${ICONS.puzzle}`,
    label: "Issues",
    path: "/issues",
  },
  {
    icon: `${ICONS.plate}`,
    label: "Live Traces",
    path: "/live-traces",
  },
  {
    icon: `${ICONS.code}`,
    label: "Raw Traces",
    path: "/raw-traces",
  },
];

export const NAV_LINKS_2: DrawerNavItemType[] = [
  {
    icon: `${ICONS.data}`,
    label: "API Catalog",
    path: "/api-keys",
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

export const PATH_TO_LABEL = {
  incidents: "Incidents",
};
