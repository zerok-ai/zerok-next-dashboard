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
      <div className={styles["drawer-container"]}>
        <MainDrawer />
      </div>
      <div className={styles["page-container"]}>
        <div className={styles["header-container"]}>
          <div className={styles["header-left"]}>
            <DrawerToggleButton />
            <ClusterSelector />
          </div>
        </div>
        <div className={styles["page-content"]}>{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
