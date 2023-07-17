import MainDrawer from "components/MainDrawer";
import styles from "./PageLayout.module.scss";
import DrawerToggleButton from "components/DrawerToggleButton";
import ClusterSelector from "components/ClusterSelector";

interface PageLayout {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayout) => {
  return (
    <div className={styles["container"]}>
      <aside className={styles["drawer-container"]}>
        <MainDrawer />
      </aside>
      <div className={styles["page-container"]}>
        <header className={styles["header-container"]}>
          <div className={styles["header-left"]}>
            <DrawerToggleButton />
            <ClusterSelector />
          </div>
        </header>
        <main className={styles["page-content"]}>{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
