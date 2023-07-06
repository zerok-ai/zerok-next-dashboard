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
import {
  GET_SPAN_ENDPOINT,
  LIST_INCIDENTS_ENDPOINT,
  LIST_SPANS_ENDPOINT,
} from "utils/endpoints";
import SpanCard from "components/SpanCard";

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

  const {
    loading: singleSpanLoading,
    error: singleSpanError,
    data: singleSpan,
    fetchData: fetchSingleSpan,
  } = useFetch<SpanDetail>("spans");

  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);

  const router = useRouter();
  const incidentId = router.query.id;

  const [isMapMinimized, setIsMapMinimized] = useState(true);
  const toggleMapMinimized = () => setIsMapMinimized(!isMapMinimized);

  const [isSpanDrawerOpen, setIsSpanDrawerOpen] = useState(false);
  const toggleSpanDrawer = () => setIsSpanDrawerOpen(!isSpanDrawerOpen);

  const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

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

    const buildSpanTree = (spans: SpanDetail[], parentSpan: SpanDetail) => {
      count++;
      if (!spans.length) return parentSpan;
      const childrenSpan = spans.filter(
        (span) => span.parent_span_id === parentSpan.span_id
      );
      if (childrenSpan.length) {
        parentSpan.children = childrenSpan;
        childrenSpan.map((span) => {
          buildSpanTree(spans, span);
        });
      }
      return parentSpan;
    };

    if (rootNode) {
      setSpanTree(buildSpanTree(formattedSpans, rootNode));
    }
  };
  useEffect(() => {
    getSpans();
  }, [spanData]);

  useEffect(() => {
    if (spanTree) {
      setSelectedSpan(spanTree.span_id as string);
      fetchSingleSpan(GET_SPAN_ENDPOINT);
    }
  }, [spanTree]);

  useEffect(() => {
    if (selectedSpan) {
      fetchSingleSpan(GET_SPAN_ENDPOINT);
    }
  }, [selectedSpan]);
  const incident = !!incidentData ? incidentData[0] : null;

  const renderSpanTree = (parentSpan: SpanDetail) => {
    const active = selectedSpan === parentSpan.span_id;
    return (
      <div className={styles["span-tree-container"]}>
        <SpanCard
          span={parentSpan}
          active={active}
          onClick={(id) => setSelectedSpan(id)}
        />
        {!!parentSpan.children?.length &&
          parentSpan.children.map((span) => renderSpanTree(span))}
      </div>
    );
  };

  console.log({ singleSpan, spanData, incidentData });

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
          {spanTree && (
            <SpanDetailDrawer isOpen={isSpanDrawerOpen}>
              <div className={styles["span-tree-container"]}>
                {renderSpanTree(spanTree)}
              </div>
            </SpanDetailDrawer>
          )}
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
