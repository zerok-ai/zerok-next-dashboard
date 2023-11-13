import cx from "classnames";
import PodDetailsCard from "components/pods/PodDetailsCard";
import ExceptionTab from "components/traces/ExceptionCard";
import TraceTable from "components/traces/TraceTable";
import TraceTree from "components/traces/TraceTree";
import { useToggle } from "hooks/useToggle";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { chatSelector } from "redux/chat/chatSlice";
import { useSelector } from "redux/store";
import { type SpanDetail, type SpanErrorDetail } from "utils/types";

import styles from "./SpanCards.module.scss";

interface SpanCardsProps {
  chatEnabled: boolean;
}

const SpanCards = ({ chatEnabled }: SpanCardsProps) => {
  const [incidentId, setIncidentId] = useState<null | string>(null);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [spans, setSpans] = useState<null | SpanDetail>(null);
  const [isTraceTableVisible, toggleTraceTable] = useToggle(false);
  const { likelyCause } = useSelector(chatSelector);
  const router = useRouter();

  useEffect(() => {
    if (isTraceTableVisible) {
      setIsScrollLocked(true);
    } else {
      setIsScrollLocked(false);
    }
  }, [isTraceTableVisible]);

  useEffect(() => {
    if (router.query.trace) {
      setIncidentId(router.query.trace as string);
    } else if (!chatEnabled) {
      setIncidentId(router.query.latest as string);
    } else if (likelyCause.event) {
      setIncidentId(likelyCause.event.incidentId);
    } else {
      setIncidentId(null);
    }
  }, [likelyCause, router.query.trace]);

  useEffect(() => {
    if (likelyCause.error) {
      setIncidentId(
        (router.query.latest as string) ?? (router.query.trace as string)
      );
    }
  }, [likelyCause.error]);

  return (
    <div className={cx(styles.container, isScrollLocked && styles.locked)}>
      <div className={styles["cards-container"]}>
        {/* TRACE TREE */}
        <section className={cx(styles["tree-container"], styles.card)}>
          <TraceTree
            updateSpans={(spans: SpanDetail | null) => {
              setSpans(spans);
            }}
            toggleTraceTable={toggleTraceTable}
            incidentId={incidentId}
          />
        </section>

        {/* EXCEPTION CARD */}
        {spans?.errors && spans?.errors.length > 0 && (
          <section className={cx(styles["exception-container"], styles.card)}>
            <ExceptionTab errors={spans.errors as SpanErrorDetail[]} />
          </section>
        )}

        {/* POD CARD */}
        <section className={cx(styles["pod-container"], styles.card)}>
          <PodDetailsCard incidentId={incidentId} />
        </section>
      </div>

      {/* TRACE TABLE */}
      {isTraceTableVisible && (
        <TraceTable
          visible={isTraceTableVisible}
          onClose={toggleTraceTable}
          incidentId={incidentId}
        />
      )}
    </div>
  );
};

export default SpanCards;
