import MainDrawer from "components/MainDrawer";
import styles from "./PageLayout.module.scss";

interface PageLayout {
  children: React.ReactNode;
}

const PageLayout = ({children}:PageLayout) => {
  return <div className={styles['container']}>
    <div className={styles['drawer-container']}>
      <MainDrawer />
    </div>
    <div className={styles['page-container']}>
      <div className={styles['page-header']}>
        <h1>Header</h1>
      </div>
      <div className={styles['page-content']}>
        <h1>content</h1>
      </div>
    </div>
  </div>;
};

export default PageLayout;
