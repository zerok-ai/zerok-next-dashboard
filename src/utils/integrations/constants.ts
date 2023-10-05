import { BRAND_LOGOS } from "utils/images";

import { type IntegrationListType } from "./types";

export const INTEGRATION_CATEGORIES = ["All", "Data sources", "Communication"];

export const INTEGRATION_APPS = [
  "slack",
  "prometheus",
  "otel",
  "ebpf",
] as const;

export const INTEGRATION_LIST: IntegrationListType[] = [
  {
    name: "prometheus",
    label: "Prometheus",
    description: "Integrate with Prometheus to connect K8s metrics to ZeroK.",
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
    integrated: true,
    tags: ["All", "Communication"],
    disabledText: "Coming soon",
  },
  {
    name: "otel",
    label: "Open Telemetry",
    description: "Connect Open Telemetry data with ZeroK.",
    url: "https://opentelemetry.io/",
    logo: BRAND_LOGOS.OPENTELEMETRY,
    category: "Data sources",
    integrated: true,
    dummy: true,
    tags: ["All", "Data sources"],
    triggerClusterModal: true,
    disableManage: true,
  },
  {
    name: "ebpf",
    label: "eBPF",
    description:
      "Integrate ZeroK with eBPF agent to fetch request/response payload data.",
    url: "https://ebpf.io/",
    integrated: false,
    logo: BRAND_LOGOS.EBPF,
    category: "Data sources",
    dummy: true,
    disabledText: "Disabled",
    tags: ["All", "Data sources"],
    helperText: "Please contact ZeroK support for more details",
    // triggerClusterModal: true,
  },
];

export const INTEGRATIONS_PAGE_SIZE = 10;
