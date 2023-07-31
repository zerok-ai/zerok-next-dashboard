import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { HiChevronRight } from "react-icons/hi";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { type SpanDetail, type SpanResponse } from "utils/types";

import styles from "./TraceTree.module.scss";
import { buildSpanTree, getRootSpan } from "./TraceTree.utils";

const spanTransformer = (spanData: SpanResponse) => {
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
      Object.keys(spanData).map((key) => {
        const parentSpan = spanData[key];
        if (span.source === spanData[key].source) {
          formattedSpans[key] = {
            ...parentSpan,
            span_id: key,
            exceptionParent: true,
          };
        }
        return true;
      });
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

const TraceTree = () => {
  const { data: spans, fetchData: fetchSpans } = useFetch<SpanResponse>(
    "spans",
    null,
    spanTransformer
  );
  const { selectedCluster } = useSelector(clusterSelector);

  const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  useEffect(() => {
    if (selectedCluster) {
      fetchSpans("/spans.json");
    }
  }, [selectedCluster]);

  useEffect(() => {
    if (spans) {
      const root = getRootSpan(spans);
      if (root) {
        setSpanTree(buildSpanTree(spans, spans[root]));
      }
    }
  }, [spans]);
  const renderSpanTree = () => {
    if (!spanTree) {
      return null;
    }
    const renderSpan = (
      span: SpanDetail,
      isTopRoot: boolean = false,
      isLastChild: boolean = false
    ) => {
      const expandIcon = <HiChevronRight className={styles["expand-icon"]} />;
      const Label = () => {
        return (
          <div className={styles["accordion-summary-content"]}>
            <span className={styles["accordion-label"]}>
              {isTopRoot ? span.source : span.destination}
            </span>
            <span className={styles.latency}>{span.latency_ns} ns</span>
          </div>
        );
      };
      const WrapperElement = ({ children }: { children: React.ReactNode }) => {
        return isLastChild ? (
          <div className={styles["last-child"]}>{children}</div>
        ) : (
          <AccordionSummary
            className={styles["accordion-summary"]}
            expandIcon={expandIcon}
          >
            {children}
          </AccordionSummary>
        );
      };
      return (
        <Accordion
          key={nanoid()}
          defaultExpanded={span.children && span.children.length > 0}
          className={styles.accordion}
        >
          <WrapperElement>
            <Label />
          </WrapperElement>
          <AccordionDetails className={styles["accordion-details"]}>
            {span.children?.map((child) => {
              const hasChildren = child.children && child.children.length > 0;
              return renderSpan(child, false, !hasChildren);
            })}
          </AccordionDetails>
        </Accordion>
      );
    };
    return renderSpan(spanTree, true);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h6>Spans</h6>
        <div className={styles["header-actions"]}></div>
      </div>
      <div className={styles.tree}>{renderSpanTree()}</div>
    </div>
  );
};

export default TraceTree;
