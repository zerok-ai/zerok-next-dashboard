import { type NextRouter } from "next/router";

export const getSpanPageLinkFromIncident = (
  incidentId: string,
  router: NextRouter
) => {
  if (router && router.query) {
    const { issue_id: issueId, scenario } = router.query;
    return `/issues/detail?issue_id=${issueId as string}&scenario=${
      scenario as string
    }&trace=${incidentId}`;
  }
  return "";
};
