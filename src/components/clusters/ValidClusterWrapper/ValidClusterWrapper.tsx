import CustomSkeleton from "components/custom/CustomSkeleton";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "redux/store";
import { isClusterHealthy } from "utils/generic/functions";

import styles from "./ValidClusterWrapper.module.scss";

interface ValidClusterWrapperProps {
  children: React.ReactNode;
}

const ValidClusterWrapper = ({ children }: ValidClusterWrapperProps) => {
  const { selectedCluster, clusters, initialized } = useSelector(
    (state) => state.cluster
  );
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    if (initialized && !clusters.length) {
      setError("Please add a cluster to continue.");
      return;
    }
    const cluster = clusters.find((c) => c.id === selectedCluster);
    if (cluster && !isClusterHealthy(cluster)) {
      setError("Please select a healthy cluster to fetch data.");
    } else if (clusters.length && !selectedCluster) {
      setError("Please select a cluster to continue.");
    } else {
      setError(null);
    }
  }, [selectedCluster, clusters, initialized]);
  if (!initialized) return <CustomSkeleton len={10} />;
  const cluster = clusters.find((c) => c.id === selectedCluster);
  const healthyCluster = cluster && isClusterHealthy(cluster);
  return (
    <Fragment>
      {!error && healthyCluster ? (
        children
      ) : (
        <div className={styles.container}>
          <h5>{error}</h5>
        </div>
      )}
    </Fragment>
  );
};

export default ValidClusterWrapper;
