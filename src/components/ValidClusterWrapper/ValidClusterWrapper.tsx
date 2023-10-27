import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "redux/store";

import styles from "./ValidClusterWrapper.module.scss";

interface ValidClusterWrapperProps {
  children: React.ReactNode;
}

const ValidClusterWrapper = ({ children }: ValidClusterWrapperProps) => {
  const { selectedCluster, clusters } = useSelector((state) => state.cluster);
  const [errorText, setErrorText] = useState<null | string>(null);
  useEffect(() => {
    if (!clusters.length) {
      setErrorText("Please add a cluster to continue.");
      return;
    }
    const cluster = clusters.find((c) => c.id === selectedCluster);
    if (
      cluster &&
      cluster.status !== "CS_HEALTHY" &&
      cluster.status !== "CS_DEGRADED"
    ) {
      setErrorText("Please select a healthy cluster to fetch data.");
      return;
    }
    if (clusters.length && !selectedCluster) {
      setErrorText("Please select a cluster to continue.");
    } else {
      setErrorText(null);
    }
  }, [selectedCluster]);
  return (
    <Fragment>
      {errorText ? (
        <div className={styles.container}>
          <h5>{errorText}</h5>
        </div>
      ) : (
        children
      )}
    </Fragment>
  );
};

export default ValidClusterWrapper;
