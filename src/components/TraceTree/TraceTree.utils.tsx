import { type SpanDetail, type SpanResponse } from "utils/types";

export const buildSpanTree = (
  spans: SpanResponse,
  parentSpan: SpanDetail,
  level: number = 0
) => {
  const keys = Object.keys(spans);
  if (keys.length === 0) {
    return parentSpan;
  }
  const childrenSpan: SpanDetail[] = [];
  keys.forEach((key) => {
    const span = spans[key];
    if (span.parent_span_id === parentSpan.span_id) {
      childrenSpan.push(span);
    }
  });

  if (childrenSpan.length > 0) {
    parentSpan.children = childrenSpan;
    ++level;
    childrenSpan.map((span) => {
      span.level = level;
      return buildSpanTree(spans, span, level);
    });
  }
  return { ...parentSpan };
};

export const getRootSpan = (spans: SpanResponse) => {
  const keys = Object.keys(spans);
  const rootSpan = keys.find((key) => {
    return spans[key].root === true;
  });
  return rootSpan;
};

export const spanTransformer = (spanData: SpanResponse) => {
  const formattedSpans: SpanResponse = {};
  const topKeys = Object.keys(spanData);
  topKeys.map((key) => {
    const span = spanData[key];
    // find root node
    if (!topKeys.includes(span.parent_span_id)) {
      span.root = true;
    }
    // check for exception span
    if (span.destination.includes("zk-client")) {
      formattedSpans[key] = { ...span, span_id: key, exception: true };
      // find it's parent
      const rootSpan = getRootSpan(spanData);
      if (rootSpan) {
        formattedSpans[rootSpan] = {
          ...formattedSpans[rootSpan],
          exceptionSpan: key,
        };
      }
    } else {
      // check if span already exists, so as to not override exception span
      if (!formattedSpans[key]) {
        formattedSpans[key] = { ...span, span_id: key };
      }
    }
    return true;
  });
  return formattedSpans;
};

export const COLORS = ["#1E7BC2", "#9B8AFB", "#FDB022", "#5925DC", "#39D896"];

export const getWidthByLevel = (level: number, leaf: boolean = false) => {
  const defaultWidth = 300;
  const width = defaultWidth - level * 8;
  return leaf ? `${width + 8}px` : `${width}px`;
};
