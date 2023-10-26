import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Modal,
} from "@mui/material";
import cx from "classnames";
import CustomSkeleton from "components/custom/CustomSkeleton";
import TraceInfoDrawer from "components/traces/TraceInfoDrawer";
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
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import { HiOutlineArrowsPointingIn } from "react-icons/hi2";
// import { fetchNewInference } from "redux/chat";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { LIST_SPANS_ENDPOINT } from "utils/endpoints";
import { convertNanoToMilliSeconds } from "utils/functions";
// import { ICON_BASE_PATH, ICONS } from "utils/images";
import { type SpanDetail, type SpanResponse } from "utils/types";

import styles from "./TraceTree.module.scss";
import {
  AccordionLabel,
  buildSpanTree,
  checkForVisibleChildren,
  COLORS,
  getRootSpan,
  SpanLatency,
  SpanLatencyTimeline,
  spanTransformer,
  TOP_BORDER_COLOR,
} from "./TraceTree.utils";

interface TraceTreeProps {
  updateSpans: (spans: SpanDetail | null) => void;
  toggleTraceTable: () => void;
  incidentId: string | null;
}

const TraceTree = ({
  updateSpans,
  toggleTraceTable,
  incidentId,
}: TraceTreeProps) => {
  const router = useRouter();
  const {
    data: spans,
    fetchData: fetchSpans,
    setData: setSpans,
  } = useFetch<SpanResponse>("spans", null, spanTransformer);
  const { selectedCluster } = useSelector(clusterSelector);
  // const [debugMode, toggleDebugMode] = useToggle(false);

  const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  // const dispatch = useDispatch();

  const [referenceTime, setReferenceTime] = useState<null | {
    totalTime: number;
    startTime: string;
  }>(null);

  const { issue_id: issueId } = router.query;

  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);

  const [isModalOpen, toggleModal] = useToggle(false);

  useEffect(() => {
    if (selectedCluster && incidentId) {
      setSpans(null);
      setSpanTree(null);
      setSelectedSpan(null);
      updateSpans(null);
      const endpoint = LIST_SPANS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issueId as string)
        .replace("{incident_id}", incidentId);
      // // const endpoint = `/fake_spans.json`;
      fetchSpans(endpoint);
    }
  }, [selectedCluster, incidentId]);

  useEffect(() => {
    if (spans) {
      const root = getRootSpan(spans);

      if (root) {
        const spanTree = buildSpanTree(spans, spans[root]);
        setSpanTree(spanTree);
        updateSpans(spanTree);
      }
    }
  }, [spans]);

  useEffect(() => {
    if (spanTree) {
      setReferenceTime({
        totalTime: convertNanoToMilliSeconds(
          spanTree.totalTime as number,
          false
        ) as number,
        startTime: spanTree.start_time,
      });
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

    const renderSpan = (
      span: SpanDetail,
      isTopRoot: boolean = false,
      isLastChild: boolean = false
    ) => {
      const highlight = !!span.errors && span.errors.length > 0;
      const hasVisibleChildren = checkForVisibleChildren(span);
      const WrapperElement = ({ children }: { children: React.ReactNode }) => {
        return isLastChild || !hasVisibleChildren ? (
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
      const level = span.level ?? 0;
      const colorsLength = COLORS.length - 1;
      const borderColor = isTopRoot
        ? TOP_BORDER_COLOR
        : COLORS[level % colorsLength];

      const defaultExpanded = isTopRoot
        ? true
        : span.children && span.children.length > 0;

      const shouldRenderLatency =
        !isTopRoot || (isTopRoot && !span.destination && !span.source);

      const nextRender = (): null | React.ReactNode => {
        if (isTopRoot) {
          return renderSpan(
            span,
            false,
            !span.children || span.children.length === 0
          );
        } else {
          return span.children?.map((child) => {
            const hasChildren = child.children && child.children.length > 0;
            if (
              child.source.includes("zk-client") ||
              child.destination.includes("zk-client")
            ) {
              return null;
            } else return renderSpan(child, false, !hasChildren);
          });
        }
      };
      const noSourceOrDestination = !span.destination;
      const isGRPC = span.protocol === "GRPC";
      const isHTTP = span.protocol === "HTTP";
      if ((noSourceOrDestination && isHTTP && !isTopRoot) || !span.protocol) {
        return nextRender();
      }
      if (isGRPC && !span.route) {
        return nextRender();
      }
      return (
        <Accordion
          key={nanoid()}
          defaultExpanded={defaultExpanded}
          className={styles.accordion}
        >
          <WrapperElement>
            <Fragment>
              <AccordionLabel
                span={span}
                highlight={highlight}
                isLastChild={isLastChild || !hasVisibleChildren}
                isTopRoot={isTopRoot}
                setSelectedSpan={setSelectedSpan}
                isModalOpen={isModalOpen}
              />
              {shouldRenderLatency && (
                <Fragment>
                  <SpanLatency latency={span.latency} />
                  <SpanLatencyTimeline
                    span={span}
                    referenceTime={referenceTime}
                  />
                </Fragment>
              )}
            </Fragment>
          </WrapperElement>
          <AccordionDetails
            className={styles["accordion-details"]}
            style={{ borderLeft: `1px solid ${borderColor}` }}
          >
            {nextRender()}
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
          <h5>
            Spans
            {/* <Button
              variant="contained"
              size="extraSmall"
              className={styles["synth-btn"]}
              onClick={() => {
                dispatch(
                  fetchNewInference({
                    incidentId: trace as string,
                    issueId: issueId as string,
                    selectedCluster: selectedCluster as string,
                  })
                );
              }}
            >
              Synthesis request{" "}
              <img src={`${ICON_BASE_PATH}/${ICONS["ai-magic"]}`} />
            </Button> */}
          </h5>
          <div className={styles["header-actions"]}>
            {!isModalOpen && (
              <Button
                className={styles["trace-btn"]}
                color="secondary"
                variant="outlined"
                size="small"
                onClick={toggleTraceTable}
              >
                All requests <HiOutlineMenu />
              </Button>
            )}
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

            {/* <IconButton
              size="small"
              className={styles["expand-btn"]}
              onClick={toggleDebugMode}
            >
              <HiOutlineBugAnt className={styles["expand-icon"]} />
            </IconButton> */}
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
              incidentId={incidentId}
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
