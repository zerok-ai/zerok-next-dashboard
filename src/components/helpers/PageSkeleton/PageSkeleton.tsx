import { Skeleton } from "@mui/material";

import styles from "./PageSkeleton.module.scss";

const PageSkeleton = () => {
  return (
    <div className={styles["skeleton-container"]}>
      <Skeleton variant="rectangular" className={styles.drawer} />
      <div className={styles["skeleton-content"]}>
        <Skeleton variant="rectangular" className={styles.header} />
        <Skeleton variant="rectangular" className={styles.content} />
      </div>
    </div>
  );
};

export default PageSkeleton;
