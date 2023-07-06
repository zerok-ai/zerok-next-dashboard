import PrivateRoute from "components/PrivateRoute";
import styles from "./IncidentDetailPage.module.scss";
import PageLayout from "components/layouts/PageLayout";
import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import { useFetch } from "hooks/useFetch";
import { IncidentDetail, SpanDetail, SpanResponse } from "utils/types";
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
import { LIST_INCIDENTS_ENDPOINT, LIST_SPANS_ENDPOINT } from "utils/endpoints";

const IncidentDetailPage = () => {
  const {
    loading: incidentLoading,
    error: incidentError,
    data: incidentData,
    fetchData: fetchIncidentData,
  } = useFetch<IncidentDetail[]>("issues");

  const {
    loading: spanLoading,
    error: spanError,
    data: spanData,
    fetchData: fetchSpanData,
  } = useFetch<SpanResponse>("spans");

  const router = useRouter();
  const incidentId = router.query.id;

  const [isMapMinimized, setIsMapMinimized] = useState(true);
  const toggleMapMinimized = () => setIsMapMinimized(!isMapMinimized);

  const [isSpanDrawerOpen, setIsSpanDrawerOpen] = useState(false);
  const toggleSpanDrawer = () => setIsSpanDrawerOpen(!isSpanDrawerOpen);

  const [spans, setSpans] = useState<SpanDetail[]>([]);

  useEffect(() => {
    if (router.isReady && !incidentId) {
      router.push("/incidents");
    } else {
      fetchIncidentData(LIST_INCIDENTS_ENDPOINT);
      fetchSpanData(LIST_SPANS_ENDPOINT);
    }
  }, [incidentId, router]);
  let count = 0;
  const getSpans = () => {
    if (!spanData) return [];
    const topKeys = Object.keys(spanData);
    let rootNode: null | SpanDetail = null;
    let formattedSpans: SpanDetail[] = [];
    for (let i = 0; i < topKeys.length; i++) {
      count++;
      const key = topKeys[i];
      const span = { ...spanData[key], span_id: key, children: [] };
      if (!topKeys.includes(span.parent_span_id)) {
        rootNode = span;
      }
      formattedSpans.push(span);
    }

    const sortedSpans = (spans: SpanDetail[], parentSpan: SpanDetail) => {
      count++;
      if (!spans.length) return;
      const childrenSpan = spans.filter(
        (span) => span.parent_span_id === parentSpan.span_id
      );
      if (childrenSpan.length) {
        parentSpan.children = childrenSpan;
        childrenSpan.map((span) => {
          sortedSpans(spans, span);
        });
      }
      return parentSpan;
    };

    if (rootNode) console.log({ count }, sortedSpans(formattedSpans, rootNode));
    return spanData;
  };
  useEffect(() => {
    getSpans();
  }, [spanData]);
  const incident = !!incidentData ? incidentData[0] : null;
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
