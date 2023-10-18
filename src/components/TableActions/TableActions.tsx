import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { type TableActionListType } from "utils/generic/types";

import styles from "./TableActions.module.scss";

interface TableActionsProps<T> {
  list: Array<TableActionListType<T>>;
  data: T;
}

const TableActions = <T,>({ list, data }: TableActionsProps<T>) => {
  if (!list || !list.length) return null;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
  return (
    <div
      className={styles.container}
      role="button"
      onClick={(e) => {
        if (anchorEl) return;
        openMenu(e);
      }}
    >
      <HiEllipsisHorizontal className={styles.icon} />
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
        {list.map((item, index) => {
          return (
            <MenuItem
              key={index}
              className={styles["menu-item"]}
              onClick={() => {
                item.onClick(data);
                closeMenu();
              }}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default TableActions;
