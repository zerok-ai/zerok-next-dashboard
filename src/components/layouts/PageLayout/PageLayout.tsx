import MainDrawer from "components/MainDrawer";
import styles from "./PageLayout.module.scss";
import DrawerToggleButton from "components/DrawerToggleButton";
import { useDispatch, useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import { CircularProgress } from "@mui/material";
import ClusterRefreshButton from "components/ClusterRefreshButton";
// import BreadcrumbX from "components/themeX/BreadcrumbX";

interface PageLayout {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayout) => {
  const clusters = useSelector(clusterSelector);
  const dispatch = useDispatch();
  return (
    <div className={styles["container"]}>
      <div className={styles["drawer-container"]}>
        <MainDrawer />
      </div>
      <div className={styles["page-container"]}>
        <div className={styles["header-container"]}>
          <DrawerToggleButton />
          <ClusterRefreshButton />
        </div>
        <div className={styles["page-content"]}>
          {/* <BreadcrumbX /> */}
          {clusters.loading ? <CircularProgress /> : children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
