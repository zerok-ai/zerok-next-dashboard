import cx from "classnames";
import Link from "next/link";
import { useSelector } from "redux/store";
import { ICON_BASE_PATH } from "utils/images";
import { type DrawerNavItemType } from "utils/types";

import styles from "./NavigationItem.module.scss";

interface NavigationItemType {
  nav: DrawerNavItemType;
  active: boolean;
}
const NavigationItem = ({ nav, active }: NavigationItemType) => {
  const drawer = useSelector((state) => state.drawer);
  const { isDrawerMinimized } = drawer;
  const iconKey = active
    ? nav.icon.replace(".svg", "_highlight.svg")
    : nav.icon;
  return (
    <Link href={nav.path}>
      <div
        className={cx(
          styles.container,
          active && styles.active,
          isDrawerMinimized && styles.minimized
        )}
      >
        <div className={styles["icon-container"]}>
          <img src={`${ICON_BASE_PATH}/${iconKey}`} alt={`${nav.label}_icon`} />
        </div>
        <p className={styles["link-label"]}>{nav.label}</p>
      </div>
    </Link>
  );
};

export default NavigationItem;
