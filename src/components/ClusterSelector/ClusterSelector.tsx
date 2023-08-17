import { Divider, MenuItem, Select } from "@mui/material";
import cx from "classnames";
import ClusterCreateModal from "components/ClusterCreateModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  clusterSelector,
  setSelectedCluster,
  triggerRefetch,
} from "redux/cluster";
import { drawerSelector } from "redux/drawer";
import { useDispatch, useSelector } from "redux/store";

import styles from "./ClusterSelector.module.scss";

const ClusterSelector = () => {
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const clusterSlice = useSelector(clusterSelector);
  const { clusters, selectedCluster, empty } = clusterSlice;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const isRootPath = router.pathname.split("/").length === 1;

  useEffect(() => {
    if (empty) {
      setIsModalVisible(true);
    }
  }, [empty]);

  const toggleModal = () => {
    setIsModalVisible((old) => !old);
  };

  const handleModalClose = () => {
    if (empty) {
      setIsModalVisible(true);
    }
    setIsModalVisible(false);
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
            dispatch(setSelectedCluster({ id: null }));
            if (!isRootPath) {
              router.push(`/${router.pathname.split("/")[1]}`);
            } else {
              dispatch(triggerRefetch());
            }
            dispatch(setSelectedCluster({ id: val.target.value }));
          }
        }}
      >
        <p className={styles["menu-header"]}>Target cluster</p>
        <Divider className={styles["menu-divider"]} />
        {clusters.length &&
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
      <ClusterCreateModal isOpen={isModalVisible} onClose={handleModalClose} />
    </div>
  );
};

export default ClusterSelector;
