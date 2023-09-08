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
        name: "Issue Detail",
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
        name: "Add new integration",
        path: "/integrations/prometheus/create",
      },
    ],
  },
};
