import cx from "classnames";
import ClusterRefreshButton from "components/ClusterRefreshButton";
import BreadcrumbX from "components/themeX/BreadcrumbX";
import TimeSelector from "components/TimeSelector";

import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  showRange: boolean;
  showRefresh: boolean;
  title: string;
  bottomRow?: React.ReactNode;
  showBreadcrumb?: boolean;
  leftExtras?: React.ReactNode[];
  rightExtras?: React.ReactNode[];
}

const PageHeader = ({
  showRange,
  showRefresh,
  title,
  leftExtras,
  rightExtras,
  bottomRow,
  showBreadcrumb = false,
}: PageHeaderProps) => {
  const hasExtras = leftExtras ?? rightExtras;
  return (
    <div className={styles.container}>
      <div className={styles["breadcrumb-container"]}>
        {showBreadcrumb && <BreadcrumbX />}
      </div>
      <div className={cx(styles["top-row"])}>
        <h3>{title}</h3>
        {hasExtras && (
          <div className={styles["top-row-extras"]}>
            <div className={cx(styles["left-extras"])}>
              {showRange && <TimeSelector />}
              {showRefresh && <ClusterRefreshButton />}
              {leftExtras &&
                leftExtras.map((ex) => {
                  return ex;
                })}
            </div>
            {rightExtras && (
              <div className={cx(styles["right-extras"])}>
                {rightExtras.map((el) => {
                  return el;
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles["bottom-row"]}>{bottomRow && bottomRow}</div>
    </div>
  );
};

export default PageHeader;
