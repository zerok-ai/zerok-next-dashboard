import ClusterSelector from "components/ClusterSelector";
import DrawerToggleButton from "components/DrawerToggleButton";
import MainDrawer from "components/MainDrawer";
import TimeSelector from "components/TimeSelector";

import styles from "./PageLayout.module.scss";

interface PageLayoutProps {
  children: React.ReactNode;
  hideRange?: boolean;
}

const PageLayout = ({ children, hideRange = false }: PageLayoutProps) => {
  return (
    <div className={styles.container}>
      <aside className={styles["drawer-container"]}>
        <MainDrawer />
      </aside>
      <div className={styles["page-container"]}>
        <header className={styles["header-container"]}>
          <div className={styles["header-left"]}>
            <DrawerToggleButton />
            <ClusterSelector />
          </div>
          <div className={styles["header-right"]}>
            {!hideRange && <TimeSelector />}
          </div>
        </header>
        <main className={styles["page-content"]}>{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
