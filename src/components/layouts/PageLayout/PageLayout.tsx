import ClusterSelector from "components/ClusterSelector";
import DrawerToggleButton from "components/DrawerToggleButton";
import MainDrawer from "components/MainDrawer";
import { useEffect } from "react";

import styles from "./PageLayout.module.scss";
interface PageLayoutProps {
  children: React.ReactNode;
}

let timer: ReturnType<typeof setTimeout>;

const PageLayout = ({ children }: PageLayoutProps) => {
  useEffect(() => {
    const body = document.querySelector("#global-container");
    body?.addEventListener("scroll", () => {
      body.classList.remove("hidden-scroll");
      clearTimeout(timer);
      timer = setTimeout(() => {
        body.classList.add("hidden-scroll");
      }, 500);
    });
  }, []);
  return (
    <div className={styles.container}>
      <aside className={styles["drawer-container"]}>
        <MainDrawer />
      </aside>
      <div className={`${styles["page-container"]}`}>
        <header className={styles["header-container"]}>
          <div className={styles["header-left"]}>
            <DrawerToggleButton />
            <ClusterSelector />
          </div>
          <div className={styles["header-right"]}></div>
        </header>
        <main
          className={`${styles["page-content"]} hidden-scroll`}
          id="global-container"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
