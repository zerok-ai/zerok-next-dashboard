import { convertNanoToMilliSeconds } from "utils/functions";
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
    if (
      !topKeys.includes(span.parent_span_id) &&
      span.protocol !== "exception"
    ) {
      span.root = true;
    }
    // check for exception span
    if (span.destination.includes("zk-client")) {
      formattedSpans[key] = { ...span, span_id: key, exception: true };
      const rootSpan = getRootSpan(spanData);
      if (rootSpan) {
        const exceptionParent = topKeys.find((k) => {
          const espan = spanData[k];
          return espan.source === span.source;
        });
        formattedSpans[rootSpan] = {
          ...formattedSpans[rootSpan],
          exceptionSpan: key,
        };
        if (exceptionParent) {
          formattedSpans[rootSpan] = {
            ...formattedSpans[rootSpan],
            exceptionParent,
          };
        }
      }
      // find exception parent
    } else {
      // check if span already exists, so as to not override exception span
      if (!formattedSpans[key]) {
        formattedSpans[key] = { ...span, span_id: key };
      }
    }
    return true;
  });
  // get the total spanlength in milliseconds
  const rootSpanId = getRootSpan(formattedSpans);
  const rootSpan = formattedSpans[rootSpanId!];
  const rootStartTime = new Date(rootSpan.time).getTime();
  const rootLatency = convertNanoToMilliSeconds(
    rootSpan.latency_ns,
    false
  ) as number;
  let max = rootLatency;
  topKeys.forEach((key) => {
    const span = formattedSpans[key];
    const latency = convertNanoToMilliSeconds(span.latency_ns, false) as number;
    const startTime = new Date(span.time).getTime();
    // const { span_id, parent_span_id, time } = span;
    const endTime = startTime + latency - rootStartTime;
    // console.log({
    //   latency,
    //   span_id,
    //   parent_span_id,
    //   time,
    //   rootLatency,
    //   rootStartTime,
    //   endTime,
    //   max,
    // });
    if (endTime > max) {
      max = endTime;
    }
  });
  console.log({ max });
  formattedSpans[rootSpanId!] = { ...rootSpan, totalTime: max };
  return formattedSpans;
};

export const COLORS = ["#1E7BC2", "#9B8AFB", "#FDB022", "#5925DC", "#39D896"];

export const getWidthByLevel = (level: number, leaf: boolean = false) => {
  const defaultWidth = 300;
  const width = defaultWidth - level * 8;
  return leaf ? `${width + 8}px` : `${width}px`;
};
