import cx from "classnames";
import BackLink from "components/helpers/BackLink";
import PodDetailsCard from "components/pods/PodDetailsCard";
import ExceptionTab from "components/traces/ExceptionCard";
import TraceGroups from "components/traces/TraceGroups";
import TraceTable from "components/traces/TraceTable";
import TraceTree from "components/traces/TraceTree";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type SpanResponse } from "utils/types";

import styles from "./SpanCards.module.scss";

const SpanCards = () => {
  const [exceptionSpan, setExceptionSpan] = useState<null | string>(null);
  const [spans, setSpans] = useState<null | SpanResponse>(null);
  const router = useRouter();
  const trace = router.query.trace;
  const issue_id = router.query.issue_id;
  useEffect(() => {
    setExceptionSpan(null);
  }, [router]);

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
      {trace && (
        <BackLink
          onBack={() => {
            const old = router.query;
            delete old.trace;
            router.push({
              pathname: router.pathname,
              query: {
                ...old,
              },
            });
          }}
          title="Back to requests"
        />
      )}
      {trace ? (
        <div className={styles["cards-container"]}>
          <div
            className={cx(
              styles["tree-container"],
              exceptionSpan && styles["tree-container-minimal"]
            )}
          >
            <TraceTree
              updateSpans={(spans: SpanResponse) => {
                setSpans(spans);
              }}
              updateExceptionSpan={(id: string) => {
                setExceptionSpan(id);
              }}
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
      ) : (
        <div className={styles["table-container"]}>
          {issue_id ? <TraceTable /> : <TraceGroups />}
        </div>
      )}
    </div>
  );
};

export default SpanCards;
