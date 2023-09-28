import cx from "classnames";
import PodDetailsCard from "components/pods/PodDetailsCard";
import ExceptionTab from "components/traces/ExceptionCard";
import TraceTable from "components/traces/TraceTable";
import TraceTree from "components/traces/TraceTree";
import { useToggle } from "hooks/useToggle";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type SpanResponse } from "utils/types";

import styles from "./SpanCards.module.scss";

interface SpanCardsProps {
  lockScroll: (val: boolean) => void;
}

const SpanCards = ({ lockScroll }: SpanCardsProps) => {
  const [exceptionSpan, setExceptionSpan] = useState<null | string>(null);
  const [spans, setSpans] = useState<null | SpanResponse>(null);
  const [isTraceTableVisible, toggleTraceTable] = useToggle(false);
  const router = useRouter();
  useEffect(() => {
    setExceptionSpan(null);
  }, [router]);

  useEffect(() => {
    if (isTraceTableVisible) {
      lockScroll(true);
    } else {
      lockScroll(false);
    }
  }, [isTraceTableVisible]);

  useEffect(() => {
    if (spans) {
      const memo = new Set<string>();
      Object.keys(spans).forEach((key) => {
        const span = spans[key];
        if (
          span.source &&
          !span.source.includes("zk-client") &&
          !memo.has(span.source)
        ) {
          memo.add(span.source);
        }
        if (
          span.destination &&
          !span.destination.includes("zk-client") &&
          !memo.has(span.destination)
        ) {
          memo.add(span.destination);
        }
      });
    }
  }, [spans]);
  return (
    <div className={styles["detail-container"]}>
      <div className={styles["cards-container"]}>
        <div
          className={cx(
            styles["tree-container"],
            exceptionSpan && styles["tree-container-minimal"]
          )}
        >
          <TraceTree
            updateSpans={(spans: SpanResponse | null) => {
              setSpans(spans);
            }}
            updateExceptionSpan={(id: string | null) => {
              setExceptionSpan(id);
            }}
            toggleTraceTable={toggleTraceTable}
          />
        </div>
        {exceptionSpan && (
          <div className={styles["exception-container"]}>
            <ExceptionTab spanKey={exceptionSpan} />
          </div>
        )}
        <div className={styles["pod-container"]}>
          <PodDetailsCard />
        </div>
      </div>
      <TraceTable visible={isTraceTableVisible} onClose={toggleTraceTable} />
    </div>
  );
};

export default SpanCards;
