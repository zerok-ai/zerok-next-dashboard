import cx from "classnames";
import ErrorBoundary from "components/ErrorBoundary";
import DrawerToggleButton from "components/helpers/DrawerToggleButton";
import UnderConstruction from "components/helpers/UnderConstruction";
import MainDrawer from "components/layouts/MainDrawer";
import ZkSnackbar from "components/themeX/ZkSnackbar";
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
  const { status, empty, error } = useSelector(clusterSelector);
  const router = useRouter();
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const blockRoute =
    status.length &&
    status !== CLUSTER_STATES.HEALTHY &&
    status !== CLUSTER_STATES.DEGRADED &&
    CLUSTER_BLOCKED_ROUTES.includes(router.pathname);

  const renderChildren = () => {
    if (empty && CLUSTER_BLOCKED_ROUTES.includes(router.pathname)) {
      return (
        <Fragment>
          <Head>
            <title>ZeroK Dashboard - Add a cluster</title>
          </Head>
          <UnderConstruction altTitle="Please add a cluster to continue." />
        </Fragment>
      );
    } else if (blockRoute) {
      return (
        <Fragment>
          <Head>
            <title>ZeroK Dashboard - Unhealthy cluster</title>
          </Head>
          <UnderConstruction altTitle="Please select a healthy cluster to continue." />
        </Fragment>
      );
    } else if (error) {
      return (
        <Fragment>
          <Head>
            <title>ZeroK Dashboard - Error</title>
          </Head>
          <UnderConstruction altTitle="Error loading cluster data." />
        </Fragment>
      );
    } else {
      return children;
    }
  };

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
          </div>
          <div className={styles["header-right"]}>{/* <UserPill /> */}</div>
        </header>
        <main
          className={`${styles["page-content"]} hidden-scroll`}
          id="global-container"
        >
          {" "}
          <ZkSnackbar />
          <ErrorBoundary>{renderChildren()}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
