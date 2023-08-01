import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import TraceInfoDrawer from "components/TraceInfoDrawer";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  spanTransformer,
} from "./TraceTree.utils";

const TraceTree = () => {
  const router = useRouter();
  const { data: spans, fetchData: fetchSpans } = useFetch<SpanResponse>(
    "spans",
    null,
    spanTransformer
  );
  const { selectedCluster } = useSelector(clusterSelector);

  const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);
  const { issue, incident } = router.query;
  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);
  console.log({ selectedSpan });
  useEffect(() => {
    if (selectedCluster) {
      const endpoint = LIST_SPANS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issue as string)
        .replace("{incident_id}", incident as string);
      // fetchSpans("/spans.json");
      fetchSpans(endpoint);
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
    console.log({ spanTree });
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
            <span
              className={styles["accordion-label"]}
              role="button"
              onClick={() => {
                setSelectedSpan(span.span_id as string);
              }}
            >
              {isTopRoot ? span.source : span.destination}
            </span>
            <span className={styles.latency}>
              {convertNanoToMilliSeconds(span.latency_ns)}
            </span>
          </div>
        );
      };
      const WrapperElement = ({ children }: { children: React.ReactNode }) => {
        return isLastChild ? (
          <div className={styles["last-child"]} role="button">
            {children}
          </div>
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
          <AccordionDetails
            className={styles["accordion-details"]}
            style={{ borderLeft: `1px solid ${COLORS[span.level ?? 0]}` }}
          >
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
