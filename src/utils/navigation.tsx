import { type DrawerNavItemType } from "./types";

export const NAV_LINKS_1: DrawerNavItemType[] = [
  {
    img: "issues.svg",
    label: "Issues",
    path: ["/", "/issues"],
    type: "single",
  },
  {
    img: "probes.svg",
    label: "Probes",
    path: ["/probes"],
    type: "single",
  },
];

export const NAV_LINKS_2: DrawerNavItemType[] = [
  {
    img: "integrations.svg",
    label: "Integrations",
    path: ["/integrations"],
    type: "single",
  },
  {
    label: "Data Privacy",
    path: ["/data-privacy"],
    type: "single",
    img: "data_privacy.svg",
    flag: {
      feature: "dataprivacy",
      flagName: "obfuscation",
    },
  },
];

export const PATH_TO_LABEL = {
  incidents: "Incidents",
};

export const USER_NAV_LINKS = [
  {
    label: "API Keys",
    path: "/api-keys",
  },
  {
    label: "Users",
    path: "/users",
  },
  {
    type: "divider",
  },
  {
    label: "Logout",
    path: "/logout",
  },
];
