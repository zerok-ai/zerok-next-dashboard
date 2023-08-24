import cx from "classnames";
import dayjs from "dayjs";
import { convertNanoToMilliSeconds } from "utils/functions";
import { type SpanDetail, type SpanResponse } from "utils/types";

import styles from "./TraceTree.module.scss";

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
  console.log(spans, { spans });
  const rootSpan = keys.find((key) => {
    return spans[key].is_root;
  });
  return rootSpan;
};

export const spanTransformer = (spanData: SpanResponse) => {
  const formattedSpans: SpanResponse = {};
  const topKeys = Object.keys(spanData);
  const rootSpan = getRootSpan(spanData);
  if (!rootSpan) {
    return {};
  }
  topKeys.map((key) => {
    const span = spanData[key];
    // check for exception span
    if (span.path.includes("exception")) {
      formattedSpans[key] = { ...span, span_id: key, exception: true };

      formattedSpans[rootSpan] = spanData[rootSpan];

      const exceptionParent = topKeys.find((k) => {
        return k === span.parent_span_id;
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
    } else {
      // check if span already exists, so as to not override exception span
      if (!formattedSpans[key]) {
        formattedSpans[key] = { ...span };
      }
    }
    return true;
  });
  // get the total spanlength in milliseconds
  const rootSpanInfo = formattedSpans[rootSpan];
  const rootStartTime = new Date(rootSpanInfo.start_time).getTime();
  const rootLatency = convertNanoToMilliSeconds(
    rootSpanInfo.latency,
    false
  ) as number;
  let max = rootLatency;
  topKeys.forEach((key) => {
    const span = formattedSpans[key];
    const latency = span.latency;
    const startTime = new Date(span.start_time).getTime();
    // const { span_id, parent_span_id, time } = span;
    const endTime = startTime + latency - rootStartTime;
    if (endTime > max) {
      max = endTime;
    }
  });
  formattedSpans[rootSpan] = { ...rootSpanInfo, totalTime: max };
  return formattedSpans;
};

export const COLORS = ["#1E7BC2", "#9B8AFB", "#FDB022", "#5925DC", "#39D896"];

export const getWidthByLevel = (level: number, leaf: boolean = false) => {
  const defaultWidth = 450;
  const width = defaultWidth - level * 9;
  return leaf ? `${width + 8}px` : `${width}px`;
};

interface AccordionLabelProps {
  span: SpanDetail;
  isLastChild: boolean;
  highlight: boolean;
  isTopRoot: boolean;
  setSelectedSpan: (spanId: string) => void;
}

export const AccordionLabel = ({
  span,
  isLastChild,
  isTopRoot,
  setSelectedSpan,
  highlight,
}: AccordionLabelProps) => {
  return (
    <div className={styles["accordion-summary-content"]}>
      <p
        className={styles["accordion-label-container"]}
        style={{
          width: getWidthByLevel(span.level ?? 0, isLastChild),
        }}
      >
        <span
          className={cx(
            styles["accordion-label"],
            highlight && styles["exception-parent"]
          )}
          role="button"
          id="span-label"
          onClick={() => {
            setSelectedSpan(span.span_id);
          }}
        >
          {isTopRoot ? span.source : span.destination}
        </span>
      </p>
    </div>
  );
};

export const SpanLatency = ({ latency }: { latency: number }) => {
  return (
    <p className={styles.latency}>{convertNanoToMilliSeconds(latency, true)}</p>
  );
};

export const SpanLatencyTimeline = ({
  span,
  referenceTime,
}: {
  span: SpanDetail;
  referenceTime: {
    startTime: string;
    totalTime: number;
  };
}) => {
  const latency = convertNanoToMilliSeconds(span.latency, false) as number;
  // const spanStartTime = new Date(span.time).getTime();
  const timelineWidth = (latency / referenceTime.totalTime) * 100;
  const timelineStart = dayjs(span.start_time).diff(
    dayjs(referenceTime.startTime),
    "milliseconds"
  );
  const timelineDisplacement = (timelineStart / referenceTime.totalTime) * 100;
  return (
    <div className={styles.timeline}>
      <p
        style={{
          width: `${timelineWidth}%`,
          marginLeft: `${timelineDisplacement}%`,
        }}
      ></p>
    </div>
  );
};
