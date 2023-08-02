import { HiLightningBolt } from "react-icons/hi";

import { ICONS } from "./images";
import { type DrawerNavItemType } from "./types";

export const NAV_LINKS_1: DrawerNavItemType[] = [
  {
    icon: `${ICONS["chart-up"]}`,
    label: "Health",
    path: "/",
    type: "single",
  },
  // {
  //   icon: `${ICONS.plate}`,
  //   label: "Classify",
  //   path: "/classify",
  // },
  {
    icon: `${ICONS.puzzle}`,
    reactIcon: (cls: string) => <HiLightningBolt className={cls} />,
    label: "Issues",
    path: "/issues",
    type: "group",
    children: [
      {
        path: "/issues",
        label: "All issues",
      },
      {
        path: "/issues",
        label: "Recently viewed",
      },
      {
        path: "/issues",
        label: "Assigned to me",
      },
    ],
    openOnClick: true,
  },
  {
    icon: `${ICONS.plate}`,
    label: "Live Traces",
    path: "/live-traces",
    type: "single",
  },
  {
    icon: `${ICONS.code}`,
    label: "Raw Traces",
    path: "/raw-traces",
    type: "single",
  },
];

export const NAV_LINKS_2: DrawerNavItemType[] = [
  {
    icon: `${ICONS.data}`,
    label: "API Catalog",
    path: "/api-keys",
    type: "single",
  },
  {
    icon: `${ICONS.dashboard}`,
    label: "Custom Dashboard",
    path: "/custom-dashboard",
    type: "single",
  },
  {
    icon: `${ICONS.bell}`,
    label: "Alerts",
    path: "/alerts",
    type: "single",
  },
];

export const PATH_TO_LABEL = {
  incidents: "Incidents",
};
