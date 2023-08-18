import ClusterSelector from "components/ClusterSelector";
import DrawerToggleButton from "components/DrawerToggleButton";
import MainDrawer from "components/MainDrawer";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { CLUSTER_STATES } from "utils/constants";

import styles from "./PageLayout.module.scss";
interface PageLayoutProps {
  children: React.ReactNode;
}

const CLUSTER_BLOCKED_ROUTES = [
  "/",
  "/probes/create",
  "/probes",
  "/issues",
  "/issues/detail",
];

const PageLayout = ({ children }: PageLayoutProps) => {
  const { status } = useSelector(clusterSelector);
  const router = useRouter();
  useEffect(() => {
    if (
      status !== CLUSTER_STATES.HEALTHY &&
      CLUSTER_BLOCKED_ROUTES.includes(router.pathname)
    ) {
      router.push("/");
    }
  }, [status]);
  return (
    <div className={styles.container}>
      <aside className={styles["drawer-container"]}>
        <MainDrawer />
      </aside>
      <div className={`${styles["page-container"]}`}>
        <header className={styles["header-container"]}>
          <div className={styles["header-left"]}>
            <DrawerToggleButton />
            <ClusterSelector />
          </div>
          <div className={styles["header-right"]}></div>
        </header>
        <main
          className={`${styles["page-content"]} hidden-scroll`}
          id="global-container"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
