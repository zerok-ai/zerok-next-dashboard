import PrivateRoute from "components/PrivateRoute";
import styles from "./IncidentDetailPage.module.scss";
import PageLayout from "components/layouts/PageLayout";
import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import { useFetch } from "hooks/useFetch";
import { IncidentDetail, SpanDetail } from "utils/types";
import { Skeleton } from "@mui/material";
import IncidentDetailMap from "components/IncidentDetailMap";

import cx from "classnames";
import { BsCodeSlash } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";
import { getRelativeTime } from "utils/dateHelpers";
import { useRouter } from "next/router";
import {
  IncidentMetadata,
  IncidentTabs,
  SpanDetailDrawer,
  SpanDrawerButton,
} from "./IncidentDetails.utils";

const IncidentDetailPage = () => {
  const {
    loading: incidentLoading,
    error: incidentError,
    data: incidentData,
  } = useFetch<IncidentDetail>("/incident.json", "issues");

  const {
    loading: spanLoading,
    error: spanError,
    data: spanData,
  } = useFetch<SpanDetail>("/spans.json", "spans");
  const router = useRouter();
  const incident = incidentData[0];
  const incidentId = router.query.id;

  const [isMapMinimized, setIsMapMinimized] = useState(true);
  const toggleMapMinimized = () => setIsMapMinimized(!isMapMinimized);

  const [isSpanDrawerOpen, setIsSpanDrawerOpen] = useState(false);
  const toggleSpanDrawer = () => setIsSpanDrawerOpen(!isSpanDrawerOpen);

  useEffect(() => {
    if (router.isReady && !incidentId) {
      router.push("/incidents");
    }
  }, [incidentId, router]);

  console.log({ spanData });

  return (
    <div>
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Incident Detail</title>
        </Head>
      </Fragment>
      <div className="page-title">
        {incidentLoading || !incident ? (
          <Skeleton className={"page-title-loader"} />
        ) : (
          <div className={styles["header"]}>
            {" "}
            <h3>{incident.issue_title}</h3>
            <IncidentMetadata incident={incident} />
          </div>
        )}
      </div>
      <div
        className={cx(
          styles["container"],
          !isMapMinimized && styles["max-map-container"]
        )}
      >
        <div className={styles["map-container"]} id="map-drawer-container">
          {/* Toggle button for drawer */}
          <SpanDrawerButton
            isOpen={isSpanDrawerOpen}
            toggleDrawer={toggleSpanDrawer}
          />
          {/* Drawer for spans */}
          <SpanDetailDrawer isOpen={isSpanDrawerOpen}>
            <h4>Draweeeeer</h4>
            <div className={styles["drawer-container"]}>
              <h1>wheeee</h1>
            </div>
          </SpanDetailDrawer>
          <IncidentDetailMap
            isMinimized={isMapMinimized}
            toggleSize={toggleMapMinimized}
          />
        </div>
        {isMapMinimized && (
          <div className={styles["incident-info-container"]}>
            <IncidentTabs />
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
