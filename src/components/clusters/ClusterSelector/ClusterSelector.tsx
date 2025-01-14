import { Divider, IconButton, MenuItem, Select, Skeleton } from "@mui/material";
import cx from "classnames";
import TooltipX from "components/themeX/TooltipX";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  clusterSelector,
  getClusters,
  openClusterModal,
  setSelectedCluster,
} from "redux/cluster";
import { drawerSelector } from "redux/drawer";
import { useDispatch, useSelector } from "redux/store";
import { CLUSTER_STATES } from "utils/constants";
import { ICON_BASE_PATH, ICONS } from "utils/images";

import styles from "./ClusterSelector.module.scss";

const ClusterSelector = () => {
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const clusterSlice = useSelector(clusterSelector);
  const { clusters, selectedCluster, empty, status, loading } = clusterSlice;
  const router = useRouter();
  const dispatch = useDispatch();

  const [isDefaultOpen, setIsDefaultOpen] = useState(false);

  const CLUSTER_BLOCKED_ROUTES = [
    "/",
    "/probes",
    "/probes/create",
    "/issues",
    "/issues/detail",
  ];

  useEffect(() => {
    if (empty && CLUSTER_BLOCKED_ROUTES.includes(router.pathname)) {
      dispatch(openClusterModal());
    }
  }, [empty]);

  useEffect(() => {
    if (
      status.length &&
      status !== CLUSTER_STATES.HEALTHY &&
      status !== CLUSTER_STATES.DEGRADED
    ) {
      setIsDefaultOpen(true);
    }
    setIsDefaultOpen(false);
  }, [status]);

  const refreshClusters = () => {
    dispatch(getClusters());
  };

  const loadingOptions = useMemo(() => {
    return [1, 2, 3].map((x) => {
      return (
        <MenuItem key={x} className={styles["menu-item"]}>
          <Skeleton height={30} width="100%" />
        </MenuItem>
      );
    });
  }, []);
  return (
    <TooltipX title="Select a cluster" placement="top" arrow={false}>
      <fieldset
        className={cx(styles.container, isDrawerMinimized && styles.minimized)}
      >
        {/* <InputLabel htmlFor="cluster-list">Cluster</InputLabel> */}
        <Select
          id="cluster-list"
          name="cluster-selector"
          defaultOpen={isDefaultOpen}
          value={selectedCluster ?? ""}
          className={styles.select}
          renderValue={(value) => {
            const label = clusters.find((cl) => cl.id === value)?.name;
            const cl = clusters.find((cl) => cl.id === value);
            if (!cl) return <span>Select a cluster</span>;
            return (
              <span className={styles["select-display"]}>
                <span
                  className={cx(
                    cl.status === CLUSTER_STATES.HEALTHY ||
                      cl.status === CLUSTER_STATES.DEGRADED
                      ? styles.healthy
                      : styles.unhealthy,
                    styles["status-icon"]
                  )}
                ></span>
                {label}
              </span>
            );
          }}
          onChange={(val) => {
            if (val !== null && val.target && val.target.value) {
              dispatch(setSelectedCluster({ id: null }));
              dispatch(setSelectedCluster({ id: val.target.value }));
            }
          }}
        >
          <div className={styles["menu-header"]}>
            <p>Target cluster</p>
            <IconButton className={styles.refresh} onClick={refreshClusters}>
              <img src={`${ICON_BASE_PATH}/${ICONS.refresh}`} alt="refresh" />
            </IconButton>
          </div>
          <Divider className={styles["menu-divider"]} />
          {loading
            ? loadingOptions
            : clusters.length &&
              clusters.map((cl) => {
                return (
                  <MenuItem
                    value={cl.id}
                    key={cl.id}
                    className={styles["menu-item"]}
                  >
                    <span
                      className={cx(
                        cl.status === CLUSTER_STATES.HEALTHY ||
                          cl.status === CLUSTER_STATES.DEGRADED
                          ? styles.healthy
                          : styles.unhealthy,
                        styles["status-icon"]
                      )}
                    ></span>
                    {cl.name}
                  </MenuItem>
                );
              })}
          <Divider />
          <MenuItem
            className={styles["new-cluster-item"]}
            onClick={() => {
              router.push("/integrations");
            }}
            value={""}
          >
            {" "}
            <AiOutlinePlus className={styles["new-cluster-item-icon"]} />{" "}
            Integrate ZeroK
          </MenuItem>
        </Select>

        {/* Modal */}
      </fieldset>
    </TooltipX>
  );
};

export default ClusterSelector;
