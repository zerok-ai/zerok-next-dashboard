import MainDrawer from "components/MainDrawer";
import styles from "./PageLayout.module.scss";
import DrawerToggleButton from "components/DrawerToggleButton";

interface PageLayout {
  children: React.ReactNode;
}

const PageLayout = ({children}:PageLayout) => {
  return <div className={styles['container']}>
    <div className={styles['drawer-container']}>
      <MainDrawer />
    </div>
    <div className={styles['page-container']}>
      <div className={styles['header-container']}>
        <DrawerToggleButton />
      </div>
      <div className={styles['page-content']}>
        <h1>{children}</h1>
      </div>
    </div>
  </div>;
};

export default PageLayout;
