import cx from "classnames";
import TooltipX from "components/themeX/TooltipX";
import { nanoid } from "nanoid";
import { Fragment } from "react";
import { type SpanResponse } from "utils/types";

import styles from "../../TraceTree.module.scss";
import { SpanLatency, SpanLatencyTimeline } from "../../TraceTree.utils";

interface SpanTreeListProps {
  spans: SpanResponse;
  onClick: (spanid: string) => void;
  isModalOpen: boolean;
  referenceTime: null | {
    totalTime: number;
    startTime: string;
  };
}

const SpanTreeList = ({
  spans,
  onClick,
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
        return (
          <div
            className={styles["list-span-container"]}
            key={nanoid()}
            style={{ width }}
          >
            <p className={styles["accordion-label-container"]}>
              <TooltipX
                title={`${spanService} ${operationName}`}
                placement="right"
                disabled={isModalOpen}
                arrow={false}
              >
                <span
                  className={cx(styles["accordion-label"])}
                  role="button"
                  id="span-label"
                  onClick={() => {
                    onClick(span.span_id);
                  }}
                >
                  {spanService}
                </span>
              </TooltipX>
              <span className={styles["operation-name"]}>{operationName}</span>
            </p>
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
