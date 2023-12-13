import { Skeleton } from "@mui/material";
import Head from "next/head";

import styles from "./PageSkeleton.module.scss";

const PageSkeleton = () => {
  return (
    <div className={styles["skeleton-container"]}>
      <Head>
        <title>ZeroK Dashboard</title>
      </Head>
      <Skeleton variant="rectangular" className={styles.drawer} />
      <div className={styles["skeleton-content"]}>
        <Skeleton variant="rectangular" className={styles.header} />
        <Skeleton variant="rectangular" className={styles.content} />
      </div>
    </div>
  );
};

export default PageSkeleton;
