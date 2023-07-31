import TraceTree from "components/TraceTree";

import styles from "./TraceDetails.module.scss";

const TraceDetails = () => {
  return (
    <div className={styles.container}>
      <TraceTree />
    </div>
  );
};

export default TraceDetails;
