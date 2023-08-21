import { type SpanDetail } from "utils/types";

export const getSpanName = (span: SpanDetail) => {
  const { protocol, route, method } = span;
  if (protocol === "http") {
    return (
      <span>
        {method} {route ?? ``}
      </span>
    );
  }
  if (protocol === "mysql") {
    return null;
  }
};
