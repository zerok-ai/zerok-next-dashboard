import PrivateRoute from "components/PrivateRoute";
import styles from "./IncidentDetailPage.module.scss";
import PageLayout from "components/layouts/PageLayout";
import { Fragment, useState } from "react";
import Head from "next/head";
import { useFetch } from "hooks/useFetch";
import { IncidentDetail } from "utils/types";
import { Skeleton } from "@mui/material";
import IncidentDetailMap from "components/IncidentDetailMap";

import cx from "classnames";

const IncidentDetailPage = () => {
  const {
    loading: incidentLoading,
    error,
    data: incidentData,
  } = useFetch<IncidentDetail>("/incident.json", "issues");
  const incident = incidentData[0];
  const [isMapMinimized, setIsMapMinimized] = useState(true);
  const toggleMapMinimized = () => setIsMapMinimized(!isMapMinimized);
  return (
    <div>
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Incident Detail</title>
        </Head>
      </Fragment>
      <h3 className="page-title">
        {incidentLoading || !incident ? (
          <Skeleton className={"page-title-loader"} />
        ) : (
          incident.issue_title
        )}
      </h3>

      <div
        className={cx(
          styles["container"],
          !isMapMinimized && styles["max-map-container"]
        )}
      >
        <div className={styles["map-container"]}>
          <IncidentDetailMap
            isMinimized={isMapMinimized}
            toggleSize={toggleMapMinimized}
          />
        </div>
        {isMapMinimized && (
          <div className={styles["info-container"]}>
            <h1>hey</h1>
          </div>
        )}
      </div>
    </div>
  );
};

IncidentDetailPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default IncidentDetailPage;
