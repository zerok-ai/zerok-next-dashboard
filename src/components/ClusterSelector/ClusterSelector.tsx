import { Divider, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import ClusterCreateModal from "components/ClusterCreateModal";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { clusterSelector, setSelectedCluster } from "redux/cluster";
import { drawerSelector } from "redux/drawer";
import { useDispatch, useSelector } from "redux/store";

import styles from "./ClusterSelector.module.scss";

const ClusterSelector = () => {
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const clusterSlice = useSelector(clusterSelector);
  const { clusters, selectedCluster } = clusterSlice;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();

  const toggleModal = () => {
    setIsModalVisible((old) => !old);
  };
  return (
    <div
      className={cx(styles.container, isDrawerMinimized && styles.minimized)}
    >
      {/* <InputLabel htmlFor="cluster-list">Cluster</InputLabel> */}
      <Select
        id="cluster-list"
        value={selectedCluster}
        className={styles.select}
        // IconComponent={StyleIcon}
        onChange={(val) => {
          if (val !== null && val.target && val.target.value) {
            dispatch(setSelectedCluster({ id: val.target.value }));
          }
        }}
      >
        <MenuItem value="" disabled>
          Target cluster
        </MenuItem>
        {clusters &&
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
