import { useMemo } from "react";
import { HiLightningBolt } from "react-icons/hi";

import { ICON_BASE_PATH, ICONS } from "./images";
import { type DrawerNavItemType } from "./types";
console.log(useMemo);
const HealthNormal = () => {
  return <img src={`${ICON_BASE_PATH}/${ICONS["chart-up"]}`} />;
};

const HealthHighlight = () => {
  return <img src={`${ICON_BASE_PATH}/chart-up_highlight.svg`} />;
};

const ProbeNormal = () => {
  return <img src={`${ICON_BASE_PATH}/${ICONS.plate}`} />;
};

const ProbeHighlight = () => {
  return <img src={`${ICON_BASE_PATH}/plate_highlight.svg`} />;
};

export const NAV_LINKS_1: DrawerNavItemType[] = [
  {
    icon: <HealthNormal />,
    highlightIcon: <HealthHighlight />,
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
    reactIcon: (cls: string) => <HiLightningBolt className={cls} />,
    label: "Issues",
    path: "/issues",
    type: "single",
  },
  {
    icon: <ProbeNormal />,
    highlightIcon: <ProbeHighlight />,
    label: "Probes",
    path: "/probes",
    type: "single",
  },
];

export const NAV_LINKS_2: DrawerNavItemType[] = [
  // {
  //   icon: `${ICONS.data}`,
  //   label: "Settings",
  //   path: "/api-keys",
  //   type: "single",
  // },
];

export const PATH_TO_LABEL = {
  incidents: "Incidents",
};
