import { DrawerNavItemType } from "utils/types";
import styles from "./NavigationItem.module.scss";
import { ICON_BASE_PATH } from "utils/images";
import Link from "next/link";

import cx from "classnames";
import { useSelector } from "redux/store";

type NavigationItemType = {
  nav: DrawerNavItemType;
  active: boolean;
};
const NavigationItem = ({ nav, active }: NavigationItemType) => {
  const drawer = useSelector((state) => state.drawer);
  const { isDrawerMinimized } = drawer;
  return (
    <Link href={nav.path}>
      <div
        className={cx(
          styles["container"],
          active && styles["active"],
          isDrawerMinimized && styles["minimized"]
        )}
      >
        <div className={styles["icon-container"]}>
          <img
            src={`${ICON_BASE_PATH}/${nav.icon}`}
            alt={`${nav.label}_icon`}
          />
        </div>
        <p className={styles["link-label"]}>{nav.label}</p>
      </div>
    </Link>
  );
};

export default NavigationItem;
