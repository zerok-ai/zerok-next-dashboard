import MainDrawer from "components/MainDrawer";
import styles from "./PageLayout.module.scss";
import DrawerToggleButton from "components/DrawerToggleButton";
import { useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import Loader from "components/mantis/Loader";
import { CircularProgress } from "@mui/material";

interface PageLayout {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayout) => {
  const clusters = useSelector(clusterSelector);
  return (
    <div className={styles["container"]}>
      <div className={styles["drawer-container"]}>
        <MainDrawer />
      </div>
      <div className={styles["page-container"]}>
        <div className={styles["header-container"]}>
          <DrawerToggleButton />
        </div>
        <div className={styles["page-content"]}>
          {clusters.loading ? <CircularProgress /> : children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
