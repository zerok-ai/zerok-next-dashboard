import cx from "classnames";
import TooltipX from "components/themeX/TooltipX";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  const [isNavOpen, setIsNavOpen] = useState(true);
  const router = useRouter();
  // const toggleNav = () => {
  //   setIsNavOpen((prev) => !prev);
  // };

  const isGroup = nav.type === "group";
  const imgSrc = !active
    ? `${ICON_BASE_PATH}/${nav.img}`
    : `${ICON_BASE_PATH}/${nav.img.split(".")[0]}_active.svg`;
  useEffect(() => {
    if (isDrawerMinimized && isNavOpen) {
      setIsNavOpen(false);
    }
    if (!isDrawerMinimized && !isNavOpen) {
      setIsNavOpen(true);
    }
  }, [isDrawerMinimized]);
  const isMinimized = isDrawerMinimized;

  return (
    <TooltipX
      title={nav.label}
      placement="right"
      arrow={false}
      disabled={!isMinimized}
    >
      <div
        className={cx(
          styles.container,
          active && styles.active,
          isDrawerMinimized && styles.minimized
        )}
        role="link"
        onClick={() => {
          router.push(nav.path[0]);
        }}
      >
        <div className={styles["nav-item"]}>
          <div className={styles["icon-container"]}>
            <img src={imgSrc} alt={nav.label} />
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
    </TooltipX>
  );
};

export default NavigationItem;
