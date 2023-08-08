import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import cx from "classnames";
import CustomSkeleton from "components/CustomSkeleton";
import TraceInfoDrawer from "components/TraceInfoDrawer";
import dayjs from "dayjs";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { HiChevronRight, HiOutlineX } from "react-icons/hi";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { LIST_SPANS_ENDPOINT } from "utils/endpoints";
import { convertNanoToMilliSeconds } from "utils/functions";
import { type SpanDetail, type SpanResponse } from "utils/types";

import styles from "./TraceTree.module.scss";
import {
  buildSpanTree,
  COLORS,
  getRootSpan,
  getWidthByLevel,
  spanTransformer,
} from "./TraceTree.utils";

interface TraceTreeProps {
  updateExceptionSpan: (id: string) => void;
  updateSpans: (spans: SpanResponse) => void;
}

const TraceTree = ({ updateExceptionSpan, updateSpans }: TraceTreeProps) => {
  const router = useRouter();
  const { data: spans, fetchData: fetchSpans } = useFetch<SpanResponse>(
    "spans",
    null,
    spanTransformer
  );
  const { selectedCluster } = useSelector(clusterSelector);

  const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);
  const [referenceTime, setReferenceTime] = useState<null | {
    totalTime: number;
    startTime: string;
  }>(null);
  const { issue, trace } = router.query;
  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);
  useEffect(() => {
    if (selectedCluster) {
      const endpoint = LIST_SPANS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issue as string)
        .replace("{incident_id}", trace as string);
      // fetchSpans("/spans.json");
      fetchSpans(endpoint);
    }
  }, [selectedCluster]);

  useEffect(() => {
    if (spans) {
      const root = getRootSpan(spans);
      updateSpans(spans);
      if (root) {
        setSpanTree(buildSpanTree(spans, spans[root]));
      }
    }
  }, [spans]);

  useEffect(() => {
    if (spanTree) {
      setReferenceTime({
        totalTime: spanTree.totalTime as number,
        startTime: spanTree.time,
      });
      if (spanTree.exceptionSpan) {
        updateExceptionSpan(spanTree.exceptionSpan);
      }
    }
  }, [spanTree]);

  const AccordionIcon = useMemo(() => {
    return <HiChevronRight className={styles["expand-icon"]} />;
  }, []);

  const renderSpanTree = () => {
    if (!spanTree || !referenceTime) {
      return <CustomSkeleton len={8} />;
    }
    const exceptionParent = spanTree.exceptionParent;

    const renderSpan = (
      span: SpanDetail,
      isTopRoot: boolean = false,
      isLastChild: boolean = false
    ) => {
      const Label = () => {
        // const exSpan = exceptionParent ? spans![exceptionParent] : null;
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
                  exceptionParent === span.span_id && styles["exception-parent"]
                )}
                role="button"
                onClick={() => {
                  setSelectedSpan(span.span_id as string);
                }}
              >
                {isTopRoot ? span.source : span.destination}
              </span>
            </p>
          </div>
        );
      };
      const WrapperElement = ({ children }: { children: React.ReactNode }) => {
        return isLastChild ? (
          <p className={cx(styles["last-child"])} role="button">
            {children}
          </p>
        ) : (
          <AccordionSummary
            className={styles["accordion-summary"]}
            expandIcon={AccordionIcon}
          >
            {children}
          </AccordionSummary>
        );
      };
      // const latencyTimeline = (span.latency_ns / referenceTime!.latency) * 100;
      const latency = convertNanoToMilliSeconds(
        span.latency_ns,
        false
      ) as number;
      // const spanStartTime = new Date(span.time).getTime();
      const timelineWidth = (latency / referenceTime.totalTime) * 100;
      const timelineStart = dayjs(referenceTime.startTime).diff(
        dayjs(span.time),
        "milliseconds"
      );
      const timelineDisplacement =
        (timelineStart / referenceTime.totalTime) * 100;
      if (isTopRoot) {
        return (
          <Accordion
            key={nanoid()}
            defaultExpanded
            className={styles.accordion}
          >
            <WrapperElement>
              <Label />
            </WrapperElement>
            <AccordionDetails className={styles["accordion-details"]}>
              {renderSpan(
                span,
                false,
                !span.children || span.children.length === 0
              )}
            </AccordionDetails>
          </Accordion>
        );
      }
      return (
        <Accordion
          key={nanoid()}
          defaultExpanded={span.children && span.children.length > 0}
          className={styles.accordion}
        >
          <WrapperElement>
            <Label />
            <p className={styles.latency}>
              {convertNanoToMilliSeconds(span.latency_ns)}
            </p>
            <p className={styles.timeline}>
              <p
                style={{
                  width: `${timelineWidth}%`,
                  marginLeft: `${timelineDisplacement}%`,
                }}
              ></p>
            </p>
          </WrapperElement>
          <AccordionDetails
            className={styles["accordion-details"]}
            style={{ borderLeft: `1px solid ${COLORS[span.level ?? 0]}` }}
          >
            {span.children?.map((child) => {
              const hasChildren = child.children && child.children.length > 0;
              if (
                child.source.includes("zk-client") ||
                child.destination.includes("zk-client")
              ) {
                return null;
              } else return renderSpan(child, false, !hasChildren);
            })}
          </AccordionDetails>
        </Accordion>
      );
    };
    return renderSpan(spanTree, true);
  };

  const resetSpan = () => {
    setSelectedSpan(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h6>Spans</h6>
        <div className={styles["header-actions"]}></div>
      </div>
      <div className={styles.tree} id="trace-tree-container">
        {renderSpanTree()}
        {selectedSpan && (
          <span
            className={styles["close-button"]}
            onClick={resetSpan}
            role="button"
          >
            <HiOutlineX className={styles["close-icon"]} />
          </span>
        )}
        {spans && selectedSpan && (
          <TraceInfoDrawer
            selectedSpan={selectedSpan}
            onClose={resetSpan}
            anchorContainer="trace-tree-container"
            allSpans={spans}
          />
        )}
      </div>
    </div>
  );
};

export default TraceTree;
