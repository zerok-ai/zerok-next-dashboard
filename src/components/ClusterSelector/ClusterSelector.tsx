import { InputLabel, MenuItem, Select } from "@mui/material";
import { BsChevronDown } from "react-icons/bs";
import styles from "./ClusterSelector.module.scss";
import { drawerSelector } from "redux/drawer";
import { useSelector } from "redux/store";

import cx from "classnames";
import { clusterSelector } from "redux/cluster";
import { useEffect, useState } from "react";

const ClusterSelector = () => {
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const clusterSlice = useSelector(clusterSelector);
  const { clusters } = clusterSlice;
  const [selectedCluster, setSelectedCluster] = useState(
    clusters.length > 0 ? clusters[0].id : ""
  );
  useEffect(() => {
    if (!selectedCluster && !!clusters.length) {
      setSelectedCluster(clusters[0].id);
    }
  }, [clusters]);
  return (
    <div
      className={cx(
        styles["container"],
        isDrawerMinimized && styles["minimized"]
      )}
    >
      <InputLabel htmlFor="cluster-list">Cluster</InputLabel>
      <Select
        id="cluster-list"
        value={selectedCluster}
        className={styles["select"]}
        IconComponent={BsChevronDown}
      >
        <MenuItem value="" disabled>
          Target cluster
        </MenuItem>
        {!!clusters.length &&
          clusters.map((cl) => {
            return <MenuItem value={cl.id}>{cl.name}</MenuItem>;
          })}
      </Select>
    </div>
  );
};

export default ClusterSelector;
