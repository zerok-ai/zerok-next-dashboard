import cx from "classnames";
import ClusterRefreshButton from "components/ClusterRefreshButton";
import BreadcrumbX from "components/themeX/BreadcrumbX";
import TimeSelector from "components/TimeSelector";

import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  showRange: boolean;
  showRefresh: boolean;
  title: string;
  extras?: React.ReactNode[];
  bottomRow?: React.ReactNode;
  showBreadcrumb?: boolean;
  align?: "left" | "right";
}

const PageHeader = ({
  showRange,
  showRefresh,
  title,
  extras,
  bottomRow,
  showBreadcrumb = false,
  align = "left",
}: PageHeaderProps) => {
  return (
    <div className={styles.container}>
      <div className={styles["breadcrumb-container"]}>
        {showBreadcrumb && <BreadcrumbX />}
      </div>
      <div
        className={cx(
          styles["top-row"],
          align === "right" && styles["top-row-right"]
        )}
      >
        <h3>{title}</h3>
        <div className={styles["top-row-actions"]}>
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
      </div>
      <div className={styles["bottom-row"]}>{bottomRow && bottomRow}</div>
    </div>
  );
};

export default PageHeader;
