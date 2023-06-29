import { useSelector, useDispatch } from "redux/store";
import styles from "./MainDrawer.module.scss";
import { Drawer } from "@mui/material";

import cssVars from "styles/variables.module.scss";
import { ZEROK_LOGO_LIGHT } from "utils/images";
import { useMemo } from "react";

const MainDrawer = () => {
  const { drawer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { isDrawerMinimized } = drawer;

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
        <h1>hey!</h1>
      </div>
    </Drawer>
  );
};

export default MainDrawer;
