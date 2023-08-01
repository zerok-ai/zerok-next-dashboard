import BackLink from "components/helpers/BackLink";
import TraceTable from "components/TraceTable";
import TraceTree from "components/TraceTree";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type TraceMetadataDetail } from "utils/issues/types";

import styles from "./TraceDetails.module.scss";

const TraceDetails = () => {
  const router = useRouter();
  const { trace } = router.query;
  const [selectedIncident, setSelectedIncident] =
    useState<null | TraceMetadataDetail>(null);
  useEffect(() => {
    if (selectedIncident) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          trace: selectedIncident.incident_id,
        },
      });
    } else {
      const oldQ = router.query;
      delete oldQ.trace;
      router.push({
        pathname: router.pathname,
        query: {
          ...oldQ,
        },
      });
    }
  }, [selectedIncident]);
  return (
    <div className={styles.container}>
      {trace && selectedIncident ? (
        <div className={styles["tree-wrapper"]}>
          <BackLink
            onBack={() => {
              setSelectedIncident(null);
            }}
            title={selectedIncident.entry_path}
          />
          <div className={styles["tree-container"]}>
            <TraceTree />
          </div>
        </div>
      ) : (
        <div className={styles["table-container"]}>
          <TraceTable
            updateIncident={(trace) => {
              setSelectedIncident(trace);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TraceDetails;
