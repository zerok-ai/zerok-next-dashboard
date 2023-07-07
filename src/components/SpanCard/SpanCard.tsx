import { SpanDetail } from "utils/types";
import styles from "./SpanCard.module.scss";
import { ICON_BASE_PATH } from "utils/images";
import { AiOutlineCheck } from "react-icons/ai";
import dayjs from "dayjs";

import cx from "classnames";

interface SpanCardProps {
  span: SpanDetail;
  active: boolean;
  onClick: (span: SpanDetail) => void;
}

const SpanCard = ({ span, active, onClick }: SpanCardProps) => {
  return (
    <div
      className={cx(styles["container"], active && styles["active"])}
      role="button"
      onClick={() => onClick(span)}
    >
      <div className={styles["span-info"]}>
        <div className={styles["connector-container"]}>
          <img src={`${ICON_BASE_PATH}/span_connector.svg`} alt="connector" />
        </div>
        <div className={styles["span-path"]}>
          <p>{span.source}</p>
          <p>{span.destination}</p>
        </div>
      </div>
      <span className={styles["bottom-row-container"]}>
        <small className={styles["span-latency-time-container"]}>
          <span className={styles["span-latency"]}>{span.latency_ms} ms</span>
          {span.timestamp &&
            dayjs(span.timestamp).format("DD MMM YYYY hh:mm:ss A")}
        </small>
        {active && <AiOutlineCheck className={styles["active-icon"]} />}
      </span>
    </div>
  );
};

export default SpanCard;
