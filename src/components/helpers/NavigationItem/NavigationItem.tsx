import cx from "classnames";
import TooltipX from "components/themeX/TooltipX";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "redux/store";
import { type DrawerNavItemType } from "utils/types";

import styles from "./NavigationItem.module.scss";

interface NavigationItemType {
  nav: DrawerNavItemType;
  active: boolean;
}
const NavigationItem = ({ nav, active }: NavigationItemType) => {
  const drawer = useSelector((state) => state.drawer);
  const { isDrawerMinimized } = drawer;
  const [isNavOpen, setIsNavOpen] = useState(true);
  const router = useRouter();
  // const toggleNav = () => {
  //   setIsNavOpen((prev) => !prev);
  // };

  const isGroup = nav.type === "group";

  useEffect(() => {
    if (isDrawerMinimized && isNavOpen) {
      setIsNavOpen(false);
    }
    if (!isDrawerMinimized && !isNavOpen) {
      setIsNavOpen(true);
    }
  }, [isDrawerMinimized]);
  const isMinimized = isDrawerMinimized && !isNavOpen;
  const LinkWrapper = ({ children }: { children: React.ReactElement }) => {
    return isMinimized ? (
      <TooltipX title={nav.label} placement="right" arrow={true}>
        {children}
      </TooltipX>
    ) : (
      <Fragment>{children}</Fragment>
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
              !active ? (
                nav.icon
              ) : (
                nav.highlightIcon
              )
            ) : (
              <span>{nav.reactIcon(styles["react-icon"])}</span>
            )}
          </div>
          <p
            className={styles["link-label"]}
            role={isGroup ? "button" : "link"}
          >
            {nav.label}
            {/* {isGroup && (
              <span className={styles["group-item-icon"]}>
                <HiOutlineChevronDown />
              </span>
            )} */}
          </p>
        </div>
        {isGroup && isNavOpen && (
          <nav className={styles["group-items"]}>
            {nav.children?.map((child) => {
              const active = router.pathname === child.path;
              return (
                <Link href={child.path} key={nanoid()}>
                  <span
                    className={cx(
                      styles["group-item"],
                      active && styles.active
                    )}
                  >
                    {child.label}
                  </span>
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
