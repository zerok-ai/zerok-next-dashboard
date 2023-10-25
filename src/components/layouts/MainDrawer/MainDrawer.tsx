import { Divider } from "@mui/material";
import NavigationItem from "components/helpers/NavigationItem";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useSelector } from "redux/store";
import cssVars from "styles/variables.module.scss";
import { ZEROK_DRAWER_LOGO, ZEROK_DRAWER_LOGO_MINIMIZED } from "utils/images";
import { NAV_LINKS_1, NAV_LINKS_2 } from "utils/navigation";
import { type DrawerNavItemType } from "utils/types";

import styles from "./MainDrawer.module.scss";
import { StyledMainDrawer } from "./MainDrawer.utils";

const MainDrawer = () => {
  const drawer = useSelector((state) => state.drawer);
  const { isDrawerMinimized } = drawer;

  const router = useRouter();
  const DrawerHeader = () => {
    const minimizedLogo = useMemo(() => {
      return <img src={ZEROK_DRAWER_LOGO_MINIMIZED} alt="zerok_logo" />;
    }, []);

    const maximizedLogo = useMemo(() => {
      return <img src={ZEROK_DRAWER_LOGO} alt="zerok_logo" />;
    }, []);

    return (
      <div className={styles["header-container"]}>
        <div className={styles["logo-container"]}>
          <Link href="/">
            {isDrawerMinimized ? minimizedLogo : maximizedLogo}
          </Link>
        </div>
      </div>
    );
  };

  const renderLinks = useCallback(
    (links: DrawerNavItemType[]) => {
      return links.map((nav) => {
        const isHomeRoute = router.pathname === "/";
        const activeLink = isHomeRoute
          ? nav.path.includes(router.pathname)
          : nav.path.includes(router.pathname.split("/")[1]);
        return (
          <NavigationItem nav={nav} key={nav.path[0]} active={activeLink} />
        );
      });
    },
    [router]
  );
  return (
    <StyledMainDrawer
      open={isDrawerMinimized}
      variant="permanent"
      anchor="left"
      className={styles.container}
      sx={{ width: cssVars.mainDrawerWidth }}
    >
      <div>
        {<DrawerHeader />}
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
