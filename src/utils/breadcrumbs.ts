export const BREADCRUMB_ROUTES: Record<
  string,
  {
    crumbs: Array<{
      name: string;
      path: string;
    }>;
  }
> = {
  "/issues/detail": {
    crumbs: [
      {
        name: "Issues",
        path: "/issues",
      },
      {
        name: "Issue Details",
        path: "issues/detail",
      },
    ],
  },
  "/probes/create": {
    crumbs: [
      {
        name: "Probes",
        path: "/probes",
      },
      {
        name: "New Probe",
        path: "probes/create",
      },
    ],
  },
  "/probes/view": {
    crumbs: [
      {
        name: "Probes",
        path: "/probes",
      },
      {
        name: "View Probe",
        path: "/probes/view",
      },
    ],
  },
  "/integrations/prometheus/list": {
    crumbs: [
      {
        name: "Integrations",
        path: "/integrations",
      },
      {
        name: "Prometheus",
        path: "/integrations/prometheus/list",
      },
    ],
  },
  "/integrations/slack/list": {
    crumbs: [
      {
        name: "Integrations",
        path: "/integrations",
      },
      {
        name: "Slack workspaces",
        path: "/integrations/slack/list",
      },
    ],
  },
  "/integrations/otel/list": {
    crumbs: [
      {
        name: "Integrations",
        path: "/integrations",
      },
      {
        name: "OTel integrations",
        path: "/integrations/otel/list",
      },
    ],
  },
  "/integrations/prometheus/edit": {
    crumbs: [
      {
        name: "Integrations",
        path: "/integrations",
      },
      {
        name: "Prometheus",
        path: "/integrations/prometheus/list",
      },
      {
        name: "Edit integration",
        path: "/integrations/prometheus/edit",
      },
    ],
  },
  "/integrations/prometheus/create": {
    crumbs: [
      {
        name: "Integrations",
        path: "/integrations",
      },
      {
        name: "Prometheus",
        path: "/integrations/prometheus/list",
      },
      {
        name: "Add new data source",
        path: "/integrations/prometheus/create",
      },
    ],
  },
};
