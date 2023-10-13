import { Skeleton } from "@mui/material";
import cx from "classnames";
import ClusterRefreshButton from "components/clusters/ClusterRefreshButton";
import TimeSelector from "components/helpers/TimeSelector";
import BreadcrumbX from "components/themeX/BreadcrumbX";
import Head from "next/head";

import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  showRange: boolean;
  showRefresh: boolean;
  title: string;
  bottomRow?: React.ReactNode;
  showBreadcrumb?: boolean;
  leftExtras?: React.ReactNode[];
  rightExtras?: React.ReactNode[];
  htmlTitle?: string;
  loading?: boolean;
  onRefresh?: () => void;
}

const PageHeader = ({
  showRange,
  showRefresh,
  title,
  leftExtras,
  rightExtras,
  bottomRow,
  htmlTitle,
  loading,
  onRefresh,
  showBreadcrumb = false,
}: PageHeaderProps) => {
  const checkForExtras = () => {
    if (leftExtras || rightExtras || showRange || showRefresh) {
      return true;
    }
    return false;
  };

  return (
    <div className={cx(styles.container)}>
      {htmlTitle && (
        <Head>
          <title>ZeroK Dashboard | {htmlTitle}</title>
        </Head>
      )}
      {showBreadcrumb && (
        <nav className={styles["breadcrumb-container"]}>{<BreadcrumbX />}</nav>
      )}
      <header className={cx(styles["top-row"])}>
        <h3>
          {loading ?? !title ? <Skeleton width="50vw" height="50px" /> : title}
        </h3>
        {checkForExtras() && (
          <div className={styles["top-row-extras"]}>
            <div className={cx(styles["left-extras"])}>
              {showRange && <TimeSelector />}
              {showRefresh && <ClusterRefreshButton onRefresh={onRefresh} />}
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
      </header>
      <div className={styles["bottom-row"]}>{bottomRow && bottomRow}</div>
    </div>
  );
};

export default PageHeader;
