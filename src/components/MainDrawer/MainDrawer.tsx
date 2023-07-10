import { useSelector } from "redux/store";
import styles from "./MainDrawer.module.scss";

import cssVars from "styles/variables.module.scss";
import { ZEROK_LOGO_LIGHT, ZEROK_MINIMAL_LOGO_LIGHT } from "utils/images";
import { useMemo } from "react";
import { NAV_LINKS_1, NAV_LINKS_2 } from "utils/navigation";
import NavigationItem from "components/NavigationItem";
import { useRouter } from "next/router";
import { StyledMainDrawer } from "./MainDrawer.utils";
import ClusterSelector from "components/ClusterSelector";
import { Divider } from "@mui/material";
import { DrawerNavItemType } from "utils/types";

const MainDrawer = () => {
  const drawer = useSelector((state) => state.drawer);
  const { isDrawerMinimized } = drawer;

  const router = useRouter();

  const DrawerHeader = () => {
    return (
      <div className={styles["header-container"]}>
        <div className={styles["logo-container"]}>
          <img
            src={
              isDrawerMinimized ? ZEROK_MINIMAL_LOGO_LIGHT : ZEROK_LOGO_LIGHT
            }
            alt="zerok_logo"
          />
        </div>
        <ClusterSelector />
      </div>
    );
  };

  const drawerHeader = useMemo(() => <DrawerHeader />, [isDrawerMinimized]);

  const renderLinks = (links:DrawerNavItemType[])=>{
    return links.map((nav) => {
      const isHomeRoute = router.asPath === "/";
      const activeLink = isHomeRoute
        ? nav.path === router.asPath
        : nav.path.includes(router.pathname.split("/")[1]);
      return (
        <NavigationItem nav={nav} key={nav.path} active={activeLink} />
      );
    })
  }
  return (
    <StyledMainDrawer
      open={isDrawerMinimized}
      variant="permanent"
      anchor="left"
      className={styles["container"]}
      sx={{ width: cssVars.mainDrawerWidth }}
    >
      <div>
        {drawerHeader}
        <nav className={styles["navigation-container"]}>
          {renderLinks(NAV_LINKS_1)}
          <Divider />
          {renderLinks(NAV_LINKS_2)}
        </nav>
      </div>
    </StyledMainDrawer>
  );
};

export default MainDrawer;
