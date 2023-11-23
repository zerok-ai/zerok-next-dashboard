import { Alert, Button } from "@mui/material";
import cx from "classnames";
import CloseDrawerIcon from "components/CloseDrawerIcon";
import CustomSkeleton from "components/custom/CustomSkeleton";
import ExpandIcon from "components/helpers/ExpandIcon";
import TraceInfoDrawer from "components/traces/TraceInfoDrawer";
import { useFetch } from "hooks/useFetch";
import { useToggle } from "hooks/useToggle";
import { useZkFlag } from "hooks/useZkFlag";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { LIST_SPANS_ENDPOINT } from "utils/endpoints";
import { convertNanoToMilliSeconds } from "utils/functions";
import { getEarliestSpan, getSpanTotalTime } from "utils/spans/functions";
import { type SpanDetail, type SpanResponse } from "utils/types";

import SpanTreeList from "./helpers/SpanTreeList";
import SynthesizeIncidentButton from "./helpers/SynthesizeIncidentButton";
import TreeWrapper from "./helpers/TreeWrapper";
import styles from "./TraceTree.module.scss";
import {
  buildSpanTree,
  getRootSpan,
  SpanAccordion,
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

  const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);
  const [listMode, , toggleListMode] = useToggle(false);

  const chatEnabled = useZkFlag("org", "gpt", "zkchat").enabled;

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
      // const endpoint = `/fake_spans.json`;
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

  const loadingSkeletons = useMemo(() => {
    return <CustomSkeleton len={8} />;
  }, []);

  const renderSpanTree = () => {
    if ((!spanTree && !listMode) || !referenceTime) {
      return loadingSkeletons;
    }
    if (listMode && spans) {
      return (
        <SpanTreeList
          spans={spans}
          onClick={setSelectedSpan}
          isModalOpen={isModalOpen}
          referenceTime={referenceTime}
          selectedSpan={selectedSpan}
        />
      );
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
          selectedSpan={selectedSpan}
        />
      );
    }
  };

  const resetSpan = () => {
    setSelectedSpan(null);
  };

  const expandIcon = useMemo(() => {
    return (
      <ExpandIcon isExpanded={isModalOpen} toggleExpansion={toggleModal} />
    );
  }, [isModalOpen]);

  const listModeAlert = useMemo(() => {
    return (
      <Alert severity="warning" className={styles.alert}>
        This trace seems to have incomplete / invalid spans.
      </Alert>
    );
  }, []);

  const allRequestsButton = useMemo(() => {
    return (
      <Button
        className={styles["trace-btn"]}
        color="secondary"
        variant="outlined"
        size="small"
        onClick={toggleTraceTable}
      >
        All requests <HiOutlineMenu />
      </Button>
    );
  }, []);

  return (
    <TreeWrapper onModalClose={toggleModal} isModalOpen={isModalOpen}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h5>
            Spans
            <SynthesizeIncidentButton
              incidentId={incidentId!}
              selectedCluster={selectedCluster!}
              isChatEnabled={chatEnabled}
              router={router}
              issueId={issueId as string}
            />
          </h5>
          <div className={styles["header-actions"]}>
            {!isModalOpen && allRequestsButton}
            {expandIcon}
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
            {/* SHOW ALERT ON INVALID SPANS */}
            {listMode && listModeAlert}
            {/* RENDER SPAN TREE */}
            {renderSpanTree()}
            {/* CLOSE ICON */}
            {selectedSpan && (
              <CloseDrawerIcon
                onClick={resetSpan}
                customClassName={styles.close}
              />
            )}
            {/* SPAN DATA */}
            {spans && selectedSpan && isModalOpen && (
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
    </TreeWrapper>
  );
};

export default TraceTree;
