import { Divider, Menu, MenuItem } from "@mui/material";
import cx from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "redux/store";
import { ICON_BASE_PATH } from "utils/images";
import { USER_NAV_LINKS } from "utils/navigation";

import styles from "./UserNavItem.module.scss";

const UserNavItem = () => {
  const drawer = useSelector((state) => state.drawer);
  const isMinimized = drawer.isDrawerMinimized;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const router = useRouter();
  useEffect(() => {
    setAnchorEl(null);
  }, [router]);
  return (
    <div className={styles.wrapper}>
      <Divider />
      <nav
        className={cx(styles.container, isMinimized && styles.minimized)}
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        <div className={styles["user-icon-container"]}>
          <img src={`${ICON_BASE_PATH}/nav_avatar.svg`} alt="user" />
        </div>
        <p>Settings</p>
      </nav>
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        className={styles.menu}
        onClose={() => {
          setAnchorEl(null);
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        style={{
          left: `${isMinimized ? 55 : 250}px`,
        }}
      >
        {USER_NAV_LINKS.map((u) => {
          if (u.type === "divider") {
            return <Divider key="u-divider" />;
          } else {
            return (
              <Link href={u.path!} key={u.path}>
                <MenuItem>{u.label}</MenuItem>
              </Link>
            );
          }
        })}
      </Menu>
    </div>
  );
};

export default UserNavItem;
