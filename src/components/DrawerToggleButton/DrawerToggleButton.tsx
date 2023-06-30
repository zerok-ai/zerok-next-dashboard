import { IconButton } from "@mui/material";
import styles from "./DrawerToggleButton.module.scss";
import { useDispatch, useSelector } from "redux/store";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { toggleDrawer } from "redux/drawer";

const DrawerToggleButton = () => {
  const drawer = useSelector((state) => state.drawer);
  const { isDrawerMinimized } = drawer;
  const dispatch = useDispatch();
  return (
    <div className={styles["container"]}>
      <IconButton
        aria-label="toggle-drawer"
        className={styles["icon-button"]}
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
