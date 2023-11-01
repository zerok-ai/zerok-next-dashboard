import { convertNanoToMilliSeconds } from "utils/functions";
import { type SpanResponse } from "utils/types";

export const getEarliestSpan = (spans: SpanResponse) => {
  const keys = Object.keys(spans);
  let earliestSpan = keys[0];
  Object.keys(spans).forEach((key) => {
    const span = spans[key];
    const espan = spans[earliestSpan];
    const earliestSpanStartTime = new Date(espan.start_time).getTime();
    const spanStartTime = new Date(span.start_time).getTime();
    // console.log({ earliestSpanStartTime, spanStartTime });
    if (spanStartTime < earliestSpanStartTime) {
      earliestSpan = key;
    }
  });
  return spans[earliestSpan].start_time;
};

export const getSpanTotalTime = (
  spans: SpanResponse,
  earliestSpanTime: string
) => {
  const keys = Object.keys(spans);
  let max = convertNanoToMilliSeconds(spans[keys[0]].latency, false) as number;
  keys.forEach((key) => {
    max += convertNanoToMilliSeconds(spans[key].latency, false) as number;
  });
  return max;
};
