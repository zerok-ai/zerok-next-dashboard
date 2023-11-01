import { Alert, Button, IconButton, Modal } from "@mui/material";
import cx from "classnames";
import CustomSkeleton from "components/custom/CustomSkeleton";
import TooltipX from "components/themeX/TooltipX";
import TraceInfoDrawer from "components/traces/TraceInfoDrawer";
import { useFetch } from "hooks/useFetch";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { Fragment, type ReactElement, useEffect, useState } from "react";
import {
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
import { getEarliestSpan, getSpanTotalTime } from "utils/spans/functions";
// import { ICON_BASE_PATH, ICONS } from "utils/images";
import { type SpanDetail, type SpanResponse } from "utils/types";

import styles from "./TraceTree.module.scss";
import {
  buildSpanTree,
  // checkForVisibleChildren,
  getRootSpan,
  SpanAccordion,
  SpanLatency,
  SpanLatencyTimeline,
  spanTransformer,
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
    initialFetchDone,
    resetInitialFetch,
  } = useFetch<SpanResponse>("spans", null, spanTransformer);
  const { selectedCluster } = useSelector(clusterSelector);
  const [spanCustomError, setSpanCustomError] = useState<null | boolean>(null);
  // const [debugMode, toggleDebugMode] = useToggle(false);

  const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);
  const [listMode, , toggleListMode] = useToggle(false);

  // const dispatch = useDispatch();

  const [referenceTime, setReferenceTime] = useState<null | {
    totalTime: number;
    startTime: string;
  }>(null);

  const { issue_id: issueId } = router.query;

  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);

  const [isModalOpen, toggleModal] = useToggle(false);

  const [isAlertOpen] = useToggle(true);

  useEffect(() => {
    if (selectedCluster && incidentId) {
      setSpans(null);
      resetInitialFetch();
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
      // fetchSpans("/spans.json");
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
      } else {
        toggleListMode(true);
      }
    }
    if (initialFetchDone && spans && Object.keys(spans).length === 0) {
      setSpanCustomError(true);
    }
    if (!spans && initialFetchDone) {
      setSpanCustomError(true);
    }
  }, [spans, initialFetchDone]);

  useEffect(() => {
    if (spans && Object.keys(spans).length > 0 && spanCustomError) {
      setSpanCustomError(false);
    }
  }, [spans, spanCustomError]);

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
    if (spans && listMode && !spanCustomError) {
      const startTime = getEarliestSpan(spans);
      const totalTime = getSpanTotalTime(spans, startTime);
      setReferenceTime({
        startTime,
        totalTime,
      });
    }
  }, [spanTree, spans, listMode, spanCustomError]);

  useEffect(() => {
    if (!isModalOpen && selectedSpan) {
      setSelectedSpan(null);
    }
  }, [isModalOpen]);

  const renderSpanTree = () => {
    if ((!spanTree && !listMode) || !referenceTime) {
      return <CustomSkeleton len={8} />;
    }

    if (listMode && spans) {
      return Object.keys(spans).map((id) => {
        const span = spans[id];
        const spanService =
          span.service_name && span.service_name.length
            ? span.service_name
            : "Unknown";
        const operationName =
          span.span_name && span.span_name.length ? ` | ${span.span_name}` : "";
        return (
          <div className={styles["list-span-container"]} key={nanoid()}>
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
                    setSelectedSpan(span.span_id);
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
      });
    }

    if (spanTree && referenceTime) {
      return (
        <SpanAccordion
          span={spanTree}
          referenceTime={referenceTime}
          isLastChild={false}
          isTopRoot={true}
          isModalOpen={isModalOpen}
          setSelectedSpan={setSelectedSpan}
        />
      );
    }
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

        {spanCustomError ? (
          <h6 className={styles["custom-error-text"]}>
            Could not fetch spans.
          </h6>
        ) : (
          <div
            className={cx(
              styles.tree,
              isModalOpen ? styles.expanded : styles.collapsed,
              spans && selectedSpan && styles["lock-scroll"]
            )}
            id="trace-tree-container"
            onClick={(e) => {
              if (!isModalOpen) {
                toggleModal();
              }
            }}
          >
            {listMode && isAlertOpen && (
              <Alert
                severity="warning"
                className={styles.alert}
                // onClose={toggleAlert}
              >
                This trace seems to have incomplete / invalid spans.
              </Alert>
            )}
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
        )}
      </div>
    </Wrapper>
  );
};

export default TraceTree;
