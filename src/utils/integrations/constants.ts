import { BRAND_LOGOS } from "utils/images";

import { type IntegrationListType } from "./types";

export const INTEGRATION_CATEGORIES = ["All", "Data sources", "Communication"];

export const INTEGRATION_LIST: IntegrationListType[] = [
  {
    name: "prometheus",
    label: "Prometheus",
    description: "Integrate with Prometheus connect K8s metrics to ZeroK.",
    url: "https://prometheus.io/",
    logo: BRAND_LOGOS.PROMETHEUS,
    category: "Data sources",
    integrated: true,
    tags: ["All", "Data sources"],
  },
  {
    name: "slack",
    label: "Slack",
    description: "Integrate with Slack to send notifications to your team.",
    url: "https://slack.com/",
    logo: BRAND_LOGOS.SLACK,
    category: "Communication",
    integrated: false,
    tags: ["All", "Communication"],
  },
];
