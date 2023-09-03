import cx from "classnames";
import ClusterSelector from "components/ClusterSelector";
import DrawerToggleButton from "components/DrawerToggleButton";
import ErrorBoundary from "components/ErrorBoundary";
import MainDrawer from "components/MainDrawer";
import UnderConstruction from "components/UnderConstruction";
import UserPill from "components/UserPill";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { clusterSelector } from "redux/cluster";
import { drawerSelector } from "redux/drawer";
import { useSelector } from "redux/store";
import { CLUSTER_STATES } from "utils/constants";

import styles from "./PageLayout.module.scss";
interface PageLayoutProps {
  children: React.ReactNode;
}

const CLUSTER_BLOCKED_ROUTES = [
  "/",
  "/probes",
  "/probes/create",
  "/issues",
  "/issues/detail",
];

const PageLayout = ({ children }: PageLayoutProps) => {
  const { status } = useSelector(clusterSelector);
  const router = useRouter();
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const blockRoute =
    status.length &&
    status !== CLUSTER_STATES.HEALTHY &&
    CLUSTER_BLOCKED_ROUTES.includes(router.pathname);

  return (
    <div className={styles.container}>
      <aside className={styles["drawer-container"]}>
        <MainDrawer />
      </aside>
      <div
        className={cx(
          styles["page-container"],
          !isDrawerMinimized && styles["full-drawer-width"]
        )}
      >
        <header className={styles["header-container"]}>
          <div className={styles["header-left"]}>
            <DrawerToggleButton />
            <ClusterSelector />
          </div>
          <div className={styles["header-right"]}>
            <UserPill />
          </div>
        </header>
        <main
          className={`${styles["page-content"]} hidden-scroll`}
          id="global-container"
        >
          <ErrorBoundary>
            {!blockRoute ? (
              children
            ) : (
              <Fragment>
                <Head>
                  <title>ZeroK Dashboard</title>
                </Head>
                <UnderConstruction altTitle="Please select a healthy cluster to continue" />
              </Fragment>
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
