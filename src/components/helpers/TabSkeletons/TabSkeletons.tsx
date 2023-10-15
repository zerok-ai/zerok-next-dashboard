import { Skeleton } from "@mui/material";
import CustomSkeleton from "components/custom/CustomSkeleton";

import styles from "./TabSkeletons.module.scss";

const TabSkeletons = () => {
  return (
    <div className={styles["skeleton-container"]}>
      <div className={styles["tab-skeletons"]}>
        <Skeleton variant="rectangular" width={100} height={30} />
        <Skeleton variant="rectangular" width={100} height={30} />
        <Skeleton variant="rectangular" width={100} height={30} />
      </div>
      <CustomSkeleton len={5} skeletonClass={styles.skeleton} />
    </div>
  );
};

export default TabSkeletons;
