import { Menu, MenuItem } from "@mui/material";
import cx from "classnames";
import ZkSpinner from "components/themeX/ZkTableSpinner";
import { nanoid } from "nanoid";
import { useState } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { type TableActionItem } from "utils/tables/types";

import styles from "./TableActions.module.scss";

interface TableActionsProps {
  list: TableActionItem[];
  loading: boolean;
}

const TableActions = ({ list, loading }: TableActionsProps) => {
  if (!list || !list.length) return null;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
  if (loading) {
    return <ZkSpinner />;
  }
  return (
    <div
      className={cx(styles.container, !!anchorEl && styles.clicked)}
      role="button"
      onClick={(e) => {
        if (anchorEl) return;
        openMenu(e);
      }}
    >
      <HiEllipsisVertical className={cx(styles.icon)} />
      <Menu
        id="table-actions-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        hideBackdrop={false}
        className={styles.menu}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorPosition={{
          left: 2000,
          top: 10,
        }}
        MenuListProps={{
          "aria-labelledby": "icon-button",
        }}
      >
        {list.map((item) => {
          return (
            <MenuItem
              onClick={item.onClick}
              key={nanoid()}
              className={styles["menu-item"]}
            >
              {item.element}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default TableActions;
