import cx from "classnames";
import ErrorBoundary from "components/ErrorBoundary";
import DrawerToggleButton from "components/helpers/DrawerToggleButton";
import MainDrawer from "components/layouts/MainDrawer";
import ZkSnackbar from "components/themeX/ZkSnackbar";
import { drawerSelector } from "redux/drawer";
import { useSelector } from "redux/store";

import styles from "./PageLayout.module.scss";
interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const { isDrawerMinimized } = useSelector(drawerSelector);

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
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
