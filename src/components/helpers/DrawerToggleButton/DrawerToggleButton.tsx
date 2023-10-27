import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { IconButton } from "@mui/material";
import TooltipX from "components/themeX/TooltipX";
import { toggleDrawer } from "redux/drawer";
import { useDispatch, useSelector } from "redux/store";

import styles from "./DrawerToggleButton.module.scss";

const DrawerToggleButton = () => {
  const drawer = useSelector((state) => state.drawer);
  const { isDrawerMinimized } = drawer;
  const dispatch = useDispatch();
  return (
    <TooltipX
      title={isDrawerMinimized ? "Open sidebar" : "Close sidebar"}
      placement="bottom"
    >
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
    </TooltipX>
  );
};

export default DrawerToggleButton;
