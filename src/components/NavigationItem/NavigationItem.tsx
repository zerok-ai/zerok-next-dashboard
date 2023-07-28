import cx from "classnames";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
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
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  const isGroup = nav.type === "group";

  const LinkWrapper = ({ children }: { children: React.ReactNode }) => {
    return isGroup ? (
      <div role="button">{children}</div>
    ) : (
      <Link href={nav.path}>{children}</Link>
    );
  };
  return (
    <LinkWrapper>
      <div
        className={cx(
          styles.container,
          active && styles.active,
          isDrawerMinimized && styles.minimized
        )}
      >
        <div className={styles["nav-item"]}>
          <div className={styles["icon-container"]}>
            {!nav.reactIcon ? (
              <img
                src={`${ICON_BASE_PATH}/${iconKey}`}
                alt={`${nav.label}_icon`}
              />
            ) : (
              <span>{nav.reactIcon(styles["react-icon"])}</span>
            )}
          </div>
          <p
            className={styles["link-label"]}
            role={isGroup ? "button" : "link"}
            onClick={isGroup ? toggleNav : undefined}
          >
            {nav.label}
            {isGroup && (
              <span className={styles["group-item-icon"]}>
                <HiOutlineChevronDown />
              </span>
            )}
          </p>
        </div>
        {isGroup && isNavOpen && (
          <nav className={styles["group-items"]}>
            {nav.children?.map((child) => {
              return (
                <Link href={child.path} key={nanoid()}>
                  <span className={styles["group-item"]}>{child.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </LinkWrapper>
  );
};

export default NavigationItem;
