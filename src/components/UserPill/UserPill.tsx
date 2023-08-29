import { Divider, Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import {
  HiOutlineCog6Tooth,
  HiOutlineKey,
  HiOutlineUser,
} from "react-icons/hi2";

import styles from "./UserPill.module.scss";

const UserPill = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null);
  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
  return (
    <div
      className={styles.container}
      role="button"
      onMouseOver={handleMouseOver}
    >
      <HiOutlineUser className={styles.icon} />
      Setting
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={closeMenu}
        className={styles.menu}
        disableAutoFocusItem
        style={{
          zIndex: 1,
        }}
        // hideBackdrop
      >
        <Link href="/api-keys">
          <MenuItem className={styles["menu-item"]}>
            <HiOutlineCog6Tooth className={styles["menu-item-icon"]} />
            <p>API Documentation</p>
          </MenuItem>
        </Link>
        <Link href="/api-keys">
          <MenuItem className={styles["menu-item"]}>
            <HiOutlineKey className={styles["menu-item-icon"]} />
            <p>API Keys</p>
          </MenuItem>
        </Link>

        <Divider />
        <Link href="/logout">
          <MenuItem className={styles["menu-item"]}>
            <HiOutlineLogout className={styles["menu-item-icon"]} />
            <p>Logout</p>
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

export default UserPill;
