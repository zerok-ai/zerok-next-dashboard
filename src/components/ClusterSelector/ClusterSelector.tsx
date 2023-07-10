import { Divider, InputLabel, MenuItem, Select } from "@mui/material";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "./ClusterSelector.module.scss";
import { drawerSelector } from "redux/drawer";
import { useDispatch, useSelector } from "redux/store";

import cx from "classnames";
import { clusterSelector, setSelectedCluster } from "redux/cluster";
import { useEffect, useState } from "react";
import ClusterCreateModal from "components/ClusterCreateModal";

const ClusterSelector = () => {
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const clusterSlice = useSelector(clusterSelector);
  const { clusters, selectedCluster } = clusterSlice;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();

  console.log({ selectedCluster });

  const toggleModal = () => setIsModalVisible((old) => !old);

  const StyleIcon = () => <BsChevronDown className={styles["select-icon"]} />;
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
        IconComponent={StyleIcon}
        onChange={(val) => {
          if (val.length) {
            dispatch(setSelectedCluster(val));
          }
        }}
      >
        <MenuItem value="" disabled>
          Target cluster
        </MenuItem>
        {!!clusters.length &&
          clusters.map((cl) => {
            return (
              <MenuItem value={cl.id} key={cl.id}>
                {cl.name}
              </MenuItem>
            );
          })}
        <Divider />
        <MenuItem
          className={styles["new-cluster-item"]}
          onClick={toggleModal}
          value={""}
        >
          {" "}
          <AiOutlinePlus className={styles["new-cluster-item-icon"]} /> Add a
          new cluster
        </MenuItem>
      </Select>

      {/* Modal */}
      <ClusterCreateModal isOpen={isModalVisible} onClose={toggleModal} />
    </div>
  );
};

export default ClusterSelector;
