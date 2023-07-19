import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { IconButton } from "@mui/material";
import { toggleDrawer } from "redux/drawer";
import { useDispatch, useSelector } from "redux/store";

import styles from "./DrawerToggleButton.module.scss";

const DrawerToggleButton = () => {
  const drawer = useSelector((state) => state.drawer);
  const { isDrawerMinimized } = drawer;
  const dispatch = useDispatch();
  return (
    <div className={styles.container}>
      <IconButton
        aria-label="toggle-drawer"
        className={styles["icon-button"]}
        size="large"
        onClick={() => {
          dispatch(toggleDrawer());
        }}
      >
        {!isDrawerMinimized ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </IconButton>
    </div>
  );
};

export default DrawerToggleButton;
