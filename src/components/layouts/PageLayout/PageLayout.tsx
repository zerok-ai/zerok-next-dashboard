import ClusterSelector from "components/ClusterSelector";
import DrawerToggleButton from "components/DrawerToggleButton";
import MainDrawer from "components/MainDrawer";

import styles from "./PageLayout.module.scss";
interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className={styles.container}>
      <aside className={styles["drawer-container"]}>
        <MainDrawer />
      </aside>
      <div className={`${styles["page-container"]} global-container`}>
        <header className={styles["header-container"]}>
          <div className={styles["header-left"]}>
            <DrawerToggleButton />
            <ClusterSelector />
          </div>
          <div className={styles["header-right"]}></div>
        </header>
        <main className={styles["page-content"]}>{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
