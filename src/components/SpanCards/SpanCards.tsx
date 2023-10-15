import cx from "classnames";
import PodDetailsCard from "components/pods/PodDetailsCard";
import ExceptionTab from "components/traces/ExceptionCard";
import TraceTable from "components/traces/TraceTable";
import TraceTree from "components/traces/TraceTree";
import { useToggle } from "hooks/useToggle";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { chatSelector } from "redux/chat";
import { useSelector } from "redux/store";
import { type SpanDetail, type SpanErrorDetail } from "utils/types";

import styles from "./SpanCards.module.scss";

interface SpanCardsProps {
  lockScroll: (val: boolean) => void;
}

const SpanCards = ({ lockScroll }: SpanCardsProps) => {
  const [incidentId, setIncidentId] = useState<null | string>(null);
  const [spans, setSpans] = useState<null | SpanDetail>(null);
  const [isTraceTableVisible, toggleTraceTable] = useToggle(false);
  const { likelyCause } = useSelector(chatSelector);
  const router = useRouter();

  useEffect(() => {
    if (isTraceTableVisible) {
      lockScroll(true);
    } else {
      lockScroll(false);
    }
  }, [isTraceTableVisible]);

  useEffect(() => {
    if (router.query.trace) {
      setIncidentId(router.query.trace as string);
    } else if (likelyCause) {
      setIncidentId(likelyCause.incidentId);
    } else {
      setIncidentId(null);
    }
  }, [likelyCause, router.query.trace]);
  return (
    <div className={styles["detail-container"]}>
      <div className={styles["cards-container"]}>
        <section className={cx(styles["tree-container"])}>
          <TraceTree
            updateSpans={(spans: SpanDetail | null) => {
              setSpans(spans);
            }}
            toggleTraceTable={toggleTraceTable}
            incidentId={incidentId}
          />
        </section>
        {spans?.errors && spans?.errors.length > 0 && (
          <div className={styles["exception-container"]}>
            <ExceptionTab errors={spans.errors as SpanErrorDetail[]} />
          </div>
        )}
        <section className={styles["pod-container"]}>
          <PodDetailsCard incidentId={incidentId} />
        </section>
      </div>
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
