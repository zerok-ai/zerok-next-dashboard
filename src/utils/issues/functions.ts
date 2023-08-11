export const getTitleFromIssue = (title: string) => {
  const split = title.split("¦");
  const name = split[0];
  const service = split[1];
  const group3 = split.length > 2 ? split[2] : null;
  return `${name}  ${service ? `  ${service} ` : ``} ${
    group3 ? `: ${group3}` : ""
  }`;
};
