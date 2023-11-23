import cx from "classnames";
import TooltipX from "components/themeX/TooltipX";
import { nanoid } from "nanoid";
import { Fragment } from "react";
import { trimString } from "utils/functions";
import { type SpanResponse } from "utils/types";

import styles from "../../TraceTree.module.scss";
import { SpanLatency, SpanLatencyTimeline } from "../../TraceTree.utils";

interface SpanTreeListProps {
  spans: SpanResponse;
  onClick: (spanid: string) => void;
  isModalOpen: boolean;
  selectedSpan: string | null;
  referenceTime: null | {
    totalTime: number;
    startTime: string;
  };
}

const SpanTreeList = ({
  spans,
  onClick,
  selectedSpan,
  isModalOpen,
  referenceTime,
}: SpanTreeListProps) => {
  return (
    <Fragment>
      {Object.keys(spans).map((id) => {
        const span = spans[id];
        const spanService =
          span.service_name && span.service_name.length
            ? span.service_name
            : "Unknown";
        const operationName =
          span.span_name && span.span_name.length ? ` | ${span.span_name}` : "";
        const width = isModalOpen ? 700 : 550;
        const spanCharCount = isModalOpen ? 35 : 25;
        const operationCharCount = isModalOpen ? 35 : 25;
        return (
          <div
            className={cx(
              styles["list-span-container"],
              selectedSpan === span.span_id && styles["selected-list-span"]
            )}
            key={nanoid()}
            onClick={() => {
              onClick(span.span_id);
            }}
          >
            <TooltipX
              title={`${spanService} | ${operationName}`}
              placement="bottom"
              disabled={false}
              arrow={false}
            >
              <div
                className={styles["accordion-label-container"]}
                style={{ width }}
              >
                <span
                  role="button"
                  id="span-label"
                  onClick={() => {
                    onClick(span.span_id);
                  }}
                  className={styles["span-service"]}
                >
                  {trimString(spanService, spanCharCount)}
                </span>
                <span className={styles["operation-name"]}>
                  {trimString(operationName, operationCharCount)}
                </span>
              </div>
            </TooltipX>
            <div className={styles["list-span-latency"]}>
              <SpanLatency latency={span.latency} />
              <SpanLatencyTimeline span={span} referenceTime={referenceTime} />
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export default SpanTreeList;
