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
        name: "Incidents",
        path: "/issues",
      },
      {
        name: "Incident Detail",
        path: "issues/detail",
      },
    ],
  },
};
