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
        path: "/issues?tab=recently-viewed",
        label: "Recently viewed",
      },
      {
        path: "/issues?tab=unassigned",
        label: "Assigned to me",
      },
    ],
    openOnClick: true,
  },
  {
    icon: `${ICONS.plate}`,
    label: "Probes",
    path: "/probes",
    type: "single",
  },
];

export const NAV_LINKS_2: DrawerNavItemType[] = [
  {
    icon: `${ICONS.data}`,
    label: "Settings",
    path: "/api-keys",
    type: "single",
  },
];

export const PATH_TO_LABEL = {
  incidents: "Incidents",
};
