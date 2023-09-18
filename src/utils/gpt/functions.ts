export const getSpanPageLinkFromIncident = (
  incidentId: string,
  issueId: string,
  scenario: string
) => {
  return `/issues/detail?issueId=${issueId}&issue=${scenario}&incidentId=${incidentId}`;
};
