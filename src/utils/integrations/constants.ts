import { BRAND_LOGOS } from "utils/images";

import { type IntegrationListType } from "./types";

export const INTEGRATION_CATEGORIES = ["Data sources", "Communication"];

export const INTEGRATION_LIST: IntegrationListType[] = [
  {
    name: "Prometheus",
    description: "Integrate with Prometheus connect K8s metrics to ZeroK",
    url: "https://prometheus.io/",
    logo: BRAND_LOGOS.SLACK,
    category: "Data sources",
  },
  {
    name: "Slack",
    description: "Integrate with Slack to send notifications to your team",
    url: "https://slack.com/",
    logo: BRAND_LOGOS.SLACK,
    category: "Communication",
  },
];
