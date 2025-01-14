import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import cx from "classnames";
import TooltipX from "components/themeX/TooltipX";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { Fragment, useMemo, useState } from "react";
import { HiChevronRight } from "react-icons/hi";
// import { HTTP_METHOD_COLORS, MYSQL_COLOR } from "utils/constants";
import { formatDuration } from "utils/dateHelpers";
import { convertNanoToMilliSeconds, trimString } from "utils/functions";
import { ICON_BASE_PATH } from "utils/images";
import {
  type SpanDetail,
  type SpanErrorDetail,
  type SpanResponse,
} from "utils/types";

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
    // const isGRPC = parentSpan.protocol === "GRPC";
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
    return spans[key].is_root;
  });
  return rootSpan;
};

export const findNearestVisibleParent = (
  spans: SpanResponse,
  span: SpanDetail
): SpanDetail | null => {
  const keys = Object.keys(spans);
  const parentSpan = keys.find((key) => {
    return spans[key].span_id === span.parent_span_id;
  });
  if (parentSpan && spans[parentSpan].destination) {
    return spans[parentSpan];
  }
  if (!parentSpan) {
    return null;
  } else {
    return findNearestVisibleParent(spans, spans[parentSpan]);
  }
};

export const spanTransformer = (spanData: SpanResponse) => {
  const formattedSpans: SpanResponse = {};
  const topKeys = Object.keys(spanData);
  const rootSpan = getRootSpan(spanData);
  if (!rootSpan) {
    return spanData;
  }
  const errors: SpanErrorDetail[] = [];
  const errorSet = new Set();
  topKeys.forEach((key) => {
    const span = spanData[key];
    formattedSpans[key] = { ...span };
    // check for exceptions span
    if (span.errors && span.errors.length > 0) {
      try {
        span.errors = JSON.parse(span.errors as string);
        (span.errors as SpanErrorDetail[]).forEach((error) => {
          if (error.message && error.hash && !errorSet.has(error.hash)) {
            errorSet.add(error.hash);
            errors.push({
              ...error,
              span_id: span.span_id,
              source: span.source,
              destination: span.destination,
              service: span.service_name ?? "Unknown",
            });
          }
        });
      } catch (err) {
        span.errors = [];
      }
    }
    span.all_attributes = {};
    if (span.resource_attributes) {
      span.all_attributes = {
        ...span.resource_attributes,
        ...span.all_attributes,
      };
    }
    if (span.span_attributes) {
      span.all_attributes = { ...span.span_attributes, ...span.all_attributes };
    }
    if (span.scope_attributes) {
      span.all_attributes = {
        ...span.scope_attributes,
        ...span.all_attributes,
      };
    }
    if (Object.keys(span.all_attributes).length === 0) {
      delete span.all_attributes;
    }
    formattedSpans[key] = { ...span };
    return true;
  });
  // get the total spanlength in milliseconds
  const rootSpanInfo = formattedSpans[rootSpan];
  rootSpanInfo.errors = errors;
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

export const TOP_BORDER_COLOR = "#506D86";

export const COLORS: string[] = [
  "rgba(30, 123, 194, 0.8)",
  "rgba(155, 138, 251, 0.8)",
  "rgba(253, 176, 34, 0.8)",
  "rgba(89, 37, 220, 0.8)",
  "rgba(57, 216, 150, 0.8)",
  "rgba(168, 66, 95, 0.8)",
  "rgba(48, 144, 212, 0.8)",
  "rgba(255, 152, 39, 0.8)",
  "rgba(118, 72, 173, 0.8)",
  "rgba(67, 221, 167, 0.8)",
];

export const checkForVisibleChildren = (span: SpanDetail) => {
  if ((span.children && span.children.length === 0) ?? !span.children) {
    return false;
  }
  const children: SpanDetail[] = [];
  const getAllChildren = (span: SpanDetail) => {
    span.children!.forEach((child) => {
      children.push(child);
      if (child.children && child.children.length > 0) {
        getAllChildren(child);
      }
    });
  };
  getAllChildren(span);
  return children.some((child) => {
    const isGRPC = child.protocol === "GRPC";
    return child.destination || (isGRPC && child.route);
  });
};

export const getWidthByLevel = (
  level: number,
  leaf: boolean = false,
  expand = true,
  isTopRoot: boolean
) => {
  const defaultWidth = expand ? 700 : 450;
  const width = defaultWidth - level * 9;
  if (isTopRoot) {
    return `${width}px`;
  }
  return leaf ? `${width + 10}px` : `${width}px`;
};

interface AccordionLabelProps {
  span: SpanDetail;
  isLastChild: boolean;
  highlight: boolean;
  isTopRoot: boolean;
  setSelectedSpan: (spanId: string) => void;
  isModalOpen: boolean;
  selectedSpan: string | null;
}

export const AccordionLabel = ({
  span,
  isLastChild,
  isTopRoot,
  setSelectedSpan,
  highlight,
  isModalOpen,
}: AccordionLabelProps) => {
  const spanService =
    span.service_name && span.service_name.length
      ? span.service_name
      : "Unknown";
  const operationName =
    span.span_name && span.span_name.length ? ` | ${span.span_name}` : "";
  const width = getWidthByLevel(
    span.level ?? 0,
    isLastChild,
    isModalOpen,
    isTopRoot
  );
  const spanTitle = `${spanService} ${operationName}`;
  const totalCharacterWidth = isModalOpen ? 80 : 40;
  const trimmedSpanTitle = trimString(spanService, totalCharacterWidth / 2);
  const trimmedOperationName = trimString(
    operationName,
    totalCharacterWidth - trimmedSpanTitle.length
  );

  return (
    <div
      className={styles["accordion-summary-content"]}
      role="button"
      id="span-label"
      onClick={() => {
        setSelectedSpan(span.span_id);
      }}
    >
      <div
        className={cx(styles["accordion-label-container"])}
        style={{
          width,
          minWidth: width,
        }}
      >
        <TooltipX
          title={spanTitle}
          disabled={
            spanTitle.length <= totalCharacterWidth ||
            !spanTitle ||
            !spanTitle.length
          }
          placement="bottom"
          arrow={false}
        >
          <p
            className={cx(
              styles["accordion-label"],
              highlight && styles["exception-parent"]
            )}
          >
            <span
              className={cx(
                highlight && styles["exception-parent"],
                styles["span-service"]
              )}
            >
              {trimmedSpanTitle}
            </span>
            <span className={styles["operation-name"]}>
              {trimmedOperationName}
            </span>
            {span.has_raw_data !== false && span.has_raw_data !== undefined && (
              // <span className={styles["raw-data-icon"]}></span>
              <img
                src={`${ICON_BASE_PATH}/wrench.svg`}
                className={styles["raw-data-icon"]}
              />
            )}
          </p>
        </TooltipX>
      </div>
    </div>
  );
};

export const SpanLatency = ({ latency }: { latency: number }) => {
  return (
    <p className={styles.latency}>
      {formatDuration(convertNanoToMilliSeconds(latency, false) as number)}
    </p>
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
          marginLeft: `${
            timelineDisplacement >= 0 && timelineDisplacement <= 100
              ? timelineDisplacement
              : 0
          }%`,
        }}
      ></p>
    </div>
  );
};

export const SpanAccordion = ({
  span,
  isLastChild,
  isTopRoot,
  setSelectedSpan,
  referenceTime,
  isModalOpen,
  selectedSpan,
}: {
  span: SpanDetail;
  isLastChild: boolean;
  isTopRoot: boolean;
  setSelectedSpan: (spanId: string) => void;
  referenceTime: {
    startTime: string;
    totalTime: number;
  };
  isModalOpen: boolean;
  selectedSpan: string | null;
}) => {
  const [expanded, setExpanded] = useState(true);
  const highlight = !!span.errors && span.errors.length > 0;
  const AccordionIcon = useMemo(() => {
    return (
      <HiChevronRight
        className={styles["expand-icon"]}
        onClick={() => {
          setExpanded(!expanded);
        }}
      />
    );
  }, [expanded]);
  // const hasVisibleChildren = checkForVisibleChildren(span);
  const WrapperElement = ({ children }: { children: React.ReactNode }) => {
    const selected = selectedSpan === span.span_id;
    return isLastChild ? (
      <div
        className={cx(
          styles["last-child"],
          selected && styles["selected-span"]
        )}
        role="button"
      >
        {children}
      </div>
    ) : (
      <AccordionSummary
        className={cx(
          styles["accordion-summary"],
          selected && styles["selected-span"]
        )}
        expandIcon={AccordionIcon}
        style={{ borderLeft: `1px solid ${borderColor}` }}
      >
        {children}
      </AccordionSummary>
    );
  };
  const level = span.level ?? 0;
  const colorsLength = COLORS.length - 1;
  const borderColor = isTopRoot
    ? TOP_BORDER_COLOR
    : COLORS[level % colorsLength];

  const defaultExpanded = isTopRoot
    ? true
    : span.children && span.children.length > 0;

  const shouldRenderLatency = true;

  const nextRender = (): null | React.ReactNode => {
    return span.children?.map((child) => {
      const hasChildren = child.children && child.children.length > 0;
      return (
        <SpanAccordion
          span={child}
          key={nanoid()}
          isLastChild={!hasChildren}
          isTopRoot={false}
          setSelectedSpan={setSelectedSpan}
          referenceTime={referenceTime}
          isModalOpen={isModalOpen}
          selectedSpan={selectedSpan}
        />
      );
    });
  };
  return (
    <Accordion
      key={nanoid()}
      defaultExpanded={defaultExpanded}
      className={styles.accordion}
      expanded={expanded}
    >
      <WrapperElement>
        <Fragment>
          <AccordionLabel
            span={span}
            highlight={highlight}
            selectedSpan={selectedSpan}
            isLastChild={isLastChild}
            isTopRoot={isTopRoot}
            setSelectedSpan={setSelectedSpan}
            isModalOpen={isModalOpen}
          />
          {shouldRenderLatency && (
            <Fragment>
              <SpanLatency latency={span.latency} />
              <SpanLatencyTimeline span={span} referenceTime={referenceTime} />
            </Fragment>
          )}
        </Fragment>
      </WrapperElement>
      <AccordionDetails className={styles["accordion-details"]}>
        {nextRender()}
      </AccordionDetails>
    </Accordion>
  );
};
