import { type NextRouter } from "next/router";

export const getSpanPageLinkFromIncident = (
  incidentId: string,
  router: NextRouter
) => {
  if (router && router.query) {
    const { issue_id: issueId, issue: scenario } = router.query;
    return `/issues/detail?issue_id=${issueId as string}&issue=${
      scenario as string
    }&trace=${incidentId}`;
  }
  return "";
};
