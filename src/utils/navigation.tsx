import { HiLightningBolt, HiOutlineShieldCheck } from "react-icons/hi";

// import { HiShieldCheck } from "react-icons/hi2";
import { ICON_BASE_PATH, ICONS } from "./images";
import { type DrawerNavItemType } from "./types";
// const HealthNormal = () => {
//   return <img src={`${ICON_BASE_PATH}/${ICONS["chart-up"]}`} />;
// };

// const HealthHighlight = () => {
//   return <img src={`${ICON_BASE_PATH}/chart-up_highlight.svg`} />;
// };

const ProbeNormal = () => {
  return <img src={`${ICON_BASE_PATH}/${ICONS.plate}`} />;
};

const ProbeHighlight = () => {
  return <img src={`${ICON_BASE_PATH}/plate_highlight.svg`} />;
};

const IntegrationsNormal = () => {
  return <img src={`${ICON_BASE_PATH}/${ICONS.code}`} />;
};

const IntegrationsHighlight = () => {
  return <img src={`${ICON_BASE_PATH}/code_highlight.svg`} />;
};

export const NAV_LINKS_1: DrawerNavItemType[] = [
  // {
  //   icon: <HealthNormal />,
  //   highlightIcon: <HealthHighlight />,
  //   label: "Services",
  //   path: "/",
  //   type: "single",
  // },
  // {
  //   icon: `${ICONS.plate}`,
  //   label: "Classify",
  //   path: "/classify",
  // },
  {
    reactIcon: (cls: string) => <HiLightningBolt className={cls} />,
    label: "Issues",
    path: ["/", "/issues"],
    type: "single",
  },
  {
    icon: <ProbeNormal />,
    highlightIcon: <ProbeHighlight />,
    label: "Probes",
    path: ["/probes"],
    type: "single",
  },
];

export const NAV_LINKS_2: DrawerNavItemType[] = [
  {
    icon: <IntegrationsNormal />,
    label: "Integrations",
    path: ["/integrations"],
    type: "single",
    highlightIcon: <IntegrationsHighlight />,
  },
  {
    reactIcon: (cls: string) => <HiOutlineShieldCheck className={cls} />,
    label: "Data Privacy",
    path: ["/data-privacy"],
    type: "single",
  },
];

export const PATH_TO_LABEL = {
  incidents: "Incidents",
};
