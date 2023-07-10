import MainDrawer from "components/MainDrawer";
import styles from "./PageLayout.module.scss";
import DrawerToggleButton from "components/DrawerToggleButton";
import { useDispatch, useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import ClusterSelector from "components/ClusterSelector";
import { CircularProgress } from "@mui/material";

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
          <div className={styles["header-left"]}>
            <DrawerToggleButton />
            <ClusterSelector />
          </div>
        </div>
        <div className={styles["page-content"]}>
          {/* <BreadcrumbX /> */}
          {clusters.loading ? <CircularProgress /> : children}
          {/* {children} */}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
