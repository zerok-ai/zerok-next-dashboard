import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Modal,
} from "@mui/material";
import cx from "classnames";
import CustomSkeleton from "components/CustomSkeleton";
import TraceInfoDrawer from "components/TraceInfoDrawer";
import dayjs from "dayjs";
import { useFetch } from "hooks/useFetch";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import {
  Fragment,
  type ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  HiChevronRight,
  HiOutlineArrowsExpand,
  HiOutlineX,
} from "react-icons/hi";
import { HiOutlineArrowsPointingIn } from "react-icons/hi2";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { LIST_SPANS_ENDPOINT } from "utils/endpoints";
import { formatMilliseconds } from "utils/functions";
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
  const [isModalOpen, toggleModal] = useToggle(false);
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
        startTime: spanTree.start_time,
      });
      if (spanTree.exceptionSpan) {
        updateExceptionSpan(spanTree.exceptionSpan);
      }
    }
  }, [spanTree]);

  useEffect(() => {
    if (!isModalOpen && selectedSpan) {
      setSelectedSpan(null);
    }
  }, [isModalOpen]);

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
        const exSpan = exceptionParent ? spans![exceptionParent] : null;
        const highlight = exSpan?.source === span.source && !isTopRoot;
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
      const WrapperElement = ({ children }: { children: React.ReactNode }) => {
        return isLastChild ? (
          <div className={cx(styles["last-child"])} role="button">
            {children}
          </div>
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
      const latency = span.latency;
      // const spanStartTime = new Date(span.time).getTime();
      const timelineWidth = (latency / referenceTime.totalTime) * 100;
      const timelineStart = dayjs(span.start_time).diff(
        dayjs(referenceTime.startTime),
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
            <AccordionDetails
              className={cx(
                styles["accordion-details"],
                styles["root-accordion"]
              )}
            >
              {renderSpan(
                span,
                false,
                !span.children || span.children.length === 0
              )}
            </AccordionDetails>
          </Accordion>
        );
      }
      const level = span.level ?? 0;
      const colorsLength = COLORS.length - 1;
      const colorIndex = level % colorsLength;
      console.log({ colorIndex, level });
      return (
        <Accordion
          key={nanoid()}
          defaultExpanded={span.children && span.children.length > 0}
          className={styles.accordion}
        >
          <WrapperElement>
            <Label />
            <p className={styles.latency}>
              {formatMilliseconds(span.latency)} {` ms`}
            </p>
            <div className={styles.timeline}>
              <p
                style={{
                  width: `${timelineWidth}%`,
                  marginLeft: `${timelineDisplacement}%`,
                }}
              ></p>
            </div>
          </WrapperElement>
          <AccordionDetails
            className={styles["accordion-details"]}
            style={{ borderLeft: `1px solid ${COLORS[colorIndex]}` }}
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

  const Wrapper = ({ children }: { children: ReactElement }) => {
    if (isModalOpen) {
      return (
        <Modal
          open={true}
          onClose={toggleModal}
          keepMounted={true}
          className={styles.modal}
          hideBackdrop={true}
        >
          <Fragment>
            <div
              className={styles.backdrop}
              role="presentation"
              onClick={toggleModal}
            ></div>
            {children}
          </Fragment>
        </Modal>
      );
    } else {
      return <Fragment>{children}</Fragment>;
    }
  };

  return (
    <Wrapper>
      <div className={styles.container}>
        <div className={styles.header}>
          <h6>Spans</h6>
          <div className={styles["header-actions"]}>
            <IconButton
              size="small"
              className={
                isModalOpen ? styles["expanded-btn"] : styles["expand-btn"]
              }
              onClick={toggleModal}
            >
              {isModalOpen ? (
                <HiOutlineArrowsPointingIn className={styles["expand-icon"]} />
              ) : (
                <HiOutlineArrowsExpand className={styles["expand-icon"]} />
              )}
            </IconButton>
          </div>
        </div>

        <div
          className={cx(
            styles.tree,
            isModalOpen ? styles.expanded : styles.collapsed
          )}
          id="trace-tree-container"
          onClick={(e) => {
            if (!isModalOpen) {
              toggleModal();
            }
          }}
        >
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
    </Wrapper>
  );
};

export default TraceTree;
