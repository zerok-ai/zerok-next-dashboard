import { Menu, MenuItem } from "@mui/material";
import cx from "classnames";
import { useState } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { TABLE_ACTION_LABELS } from "utils/tables/constants";
import {
  type TableActionPropType,
  type TableActionType,
} from "utils/tables/types";

import styles from "./TableActions.module.scss";

interface TableActionsProps<T> {
  list: TableActionPropType<T>;
  data: T;
}

const TableActions = <T,>({ list, data }: TableActionsProps<T>) => {
  if (!list || !Object.keys(list).length) return null;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
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
        {Object.keys(list).map((key, index) => {
          const item = list[key as TableActionType];
          if (!item) return null;
          const label = TABLE_ACTION_LABELS[key as TableActionType];
          return (
            <MenuItem
              key={index}
              className={styles["menu-item"]}
              onClick={() => {
                item.onClick(data);
                closeMenu();
              }}
            >
              {label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default TableActions;
