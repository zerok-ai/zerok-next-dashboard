import BreadcrumbX from "components/BreadcrumbX";
import ClusterRefreshButton from "components/ClusterRefreshButton";
import TimeSelector from "components/TimeSelector";

import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  showRange: boolean;
  showRefresh: boolean;
  title: string;
  extras?: React.ReactNode[];
  bottomRow?: React.ReactNode;
  showBreadcrumb: boolean;
}

const PageHeader = ({
  showRange,
  showRefresh,
  title,
  extras,
  bottomRow,
  showBreadcrumb = false,
}: PageHeaderProps) => {
  return (
    <div className={styles.container}>
      <div className={styles["breadcrumb-container"]}>
        {showBreadcrumb && <BreadcrumbX />}
      </div>
      <div className={styles["top-row"]}>
        <h3>{title}</h3>
        {showRange && <TimeSelector />}
        {showRefresh && <ClusterRefreshButton />}
        {extras && (
          <div className={styles.extras}>
            {extras.map((el) => {
              return el;
            })}
          </div>
        )}
      </div>
      <div className={styles["bottom-row"]}>{bottomRow && bottomRow}</div>
    </div>
  );
};

export default PageHeader;
