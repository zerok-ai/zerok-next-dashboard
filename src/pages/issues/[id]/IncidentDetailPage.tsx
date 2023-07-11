"use client";
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
import { useRouter } from "next/router";
import IncidentTabs, {
  IncidentMetadata,
  IncidentNavButtons,
  SpanDetailDrawer,
  SpanDrawerButton,
} from "./IncidentDetails.utils";
import {
  GET_SPAN_ENDPOINT,
  LIST_INCIDENTS_ENDPOINT,
  LIST_SPANS_ENDPOINT,
} from "utils/endpoints";
import SpanCard from "components/SpanCard";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "redux/store";
import { drawerSelector, minimizeDrawer } from "redux/drawer";

const IncidentDetailPage = () => {
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const dispatch = useDispatch();
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

  const [selectedSpan, setSelectedSpan] = useState<SpanDetail | null>(null);

  const router = useRouter();
  const incidentId = router.query.id;

  const [isMapMinimized, setIsMapMinimized] = useState(true);
  const toggleMapMinimized = () => setIsMapMinimized(!isMapMinimized);

  const [isSpanDrawerOpen, setIsSpanDrawerOpen] = useState(false);
  const toggleSpanDrawer = () => setIsSpanDrawerOpen(!isSpanDrawerOpen);

  const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  useEffect(() => {
    if (router.isReady && !incidentId) {
      router.push("/issues");
    } else {
      fetchIncidentData(LIST_INCIDENTS_ENDPOINT);
      fetchSpanData(LIST_SPANS_ENDPOINT);
    }
  }, [incidentId, router]);

  useEffect(() => {
    if (isSpanDrawerOpen && !isDrawerMinimized) {
      dispatch(minimizeDrawer());
    }
  }, [isSpanDrawerOpen]);

  const getSpans = () => {
    if (!spanData) return [];
    const topKeys = Object.keys(spanData);
    let rootNode: null | SpanDetail = null;
    let formattedSpans: SpanDetail[] = [];
    for (let i = 0; i < topKeys.length; i++) {
      const key = topKeys[i];
      const span = { ...spanData[key], span_id: key, children: [] };
      if (!topKeys.includes(span.parent_span_id)) {
        rootNode = span;
      }
      formattedSpans.push(span);
    }

    const buildSpanTree = (
      spans: SpanDetail[],
      parentSpan: SpanDetail,
      level: number = 0
    ) => {
      if (!spans.length) {
        return parentSpan;
      }
      const childrenSpan = spans.filter(
        (span) => span.parent_span_id === parentSpan.span_id
      );
      if (childrenSpan.length) {
        parentSpan.children = childrenSpan;
        ++level;
        childrenSpan.map((span) => {
          span.level = level;
          return buildSpanTree(spans, span, level);
        });
      }
      return { ...parentSpan };
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
      setSelectedSpan(spanTree);
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
    const active = selectedSpan?.span_id === parentSpan.span_id;
    return (
      <div className={styles["span-tree-container"]} key={nanoid()}>
        <SpanCard
          span={parentSpan}
          active={active}
          onClick={(selectedSpan) => setSelectedSpan(selectedSpan)}
        />
        {!!parentSpan.children?.length &&
          parentSpan.children.map((span) => renderSpanTree(span))}
      </div>
    );
  };
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
            <div className={styles["header-left"]}>
              {" "}
              <h3>{incident.issue_title}</h3>
              <IncidentMetadata incident={incident} />
            </div>
            <div className={styles["header-right"]}>
              <IncidentNavButtons />
            </div>
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
            spanData={spanData}
            spanTree={spanTree}
            onNodeClick={(span: SpanDetail) => setSelectedSpan(span)}
          />
        </div>
        {isMapMinimized && (
          <div className={styles["incident-info-container"]}>
            <IncidentTabs selectedSpan={selectedSpan} />
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
