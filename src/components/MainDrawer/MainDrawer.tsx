import { useSelector, useDispatch } from "redux/store";
import styles from "./MainDrawer.module.scss";
import { Drawer } from "@mui/material";

import cssVars from "styles/variables.module.scss";
import { ZEROK_LOGO_LIGHT } from "utils/images";
import { useMemo } from "react";
import { NAV_LINKS_1 } from "utils/navigation";
import NavigationItem from "components/NavigationItem";
import { useRouter } from "next/router";

const MainDrawer = () => {
  const { drawer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { isDrawerMinimized } = drawer;

  const router = useRouter();

  const DrawerHeader = () => {
    return (
      <div className={styles["header-container"]}>
        <img src={ZEROK_LOGO_LIGHT} alt="zerok_logo" />
      </div>
    );
  };

  const drawerHeader = useMemo(()=><DrawerHeader />,[isDrawerMinimized]);
  return (
    <Drawer
      open={true}
      variant="permanent"
      anchor="left"
      className={styles["container"]}
      sx={{ width: cssVars.mainDrawerWidth }}
    >
      <div>
        {drawerHeader}
        <div className={styles['navigation-container']}>
        {NAV_LINKS_1.map((nav)=>{
          const activeLink = router.asPath === nav.path;
          return <NavigationItem nav={nav} key={nav.path} active={activeLink} />
        })}
        </div>
      </div>
    </Drawer>
  );
};

export default MainDrawer;
