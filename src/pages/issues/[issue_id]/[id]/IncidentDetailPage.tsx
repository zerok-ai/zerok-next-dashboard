"use client";
import { Skeleton } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import cx from "classnames";
import IncidentDetailMap from "components/IncidentDetailMap";
import IncidentInfoTabs from "components/IncidentInfoTabs";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import SpanCard from "components/SpanCard";
import { useFetch } from "hooks/useFetch";
import { useSticky } from "hooks/useSticky";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { clusterSelector } from "redux/cluster";
import { drawerSelector, minimizeDrawer } from "redux/drawer";
import { setIncidentList } from "redux/incidentList";
import { useDispatch, useSelector } from "redux/store";
import { GET_ISSUE_ENDPOINT, LIST_SPANS_ENDPOINT } from "utils/endpoints";
import { getTitleFromIssue } from "utils/functions";
import {
  type IssueDetail,
  type SpanDetail,
  type SpanResponse,
} from "utils/types";

import styles from "./IncidentDetailPage.module.scss";
import {
  buildSpanTree,
  IncidentMetadata,
  IncidentNavButtons,
  SpanDetailDrawer,
  SpanDrawerButton,
} from "./IncidentDetails.utils";

const IncidentDetailPage = () => {
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const { selectedCluster } = useSelector(clusterSelector);
  const dispatch = useDispatch();

  // Issue metadata - title,description,time etc
  const {
    loading: issueLoading,
    error: incidentError,
    data: issue,
    fetchData: fetchIssueData,
  } = useFetch<IssueDetail>("issue");

  // Span data - overviews of each of the spans for this incident ID
  const {
    loading: spanLoading,
    error: spanError,
    data: spanData,
    fetchData: fetchSpanData,
    setData: setSpanData,
  } = useFetch<SpanResponse>("spans");

  // Selected span - which span is currently selected, used for fetching raw data to show in the infotabs
  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);

  const router = useRouter();

  const incidentId = router.query.id;
  const issueId = router.query.issue_id;

  const [isMapMinimized, setIsMapMinimized] = useState(true);
  const toggleMapMinimized = () => {
    setIsMapMinimized(!isMapMinimized);
  };

  const [isSpanDrawerOpen, setIsSpanDrawerOpen] = useState(false);
  const toggleSpanDrawer = () => {
    setIsSpanDrawerOpen(!isSpanDrawerOpen);
  };

  const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  // Sticky header boolean and ref
  const { isSticky, stickyRef } = useSticky();

  // Fetch issue data on mount
  useEffect(() => {
    if (issueId !== undefined && selectedCluster !== null) {
      fetchIssueData(
        GET_ISSUE_ENDPOINT.replace("{cluster_id}", selectedCluster).replace(
          "{issue_id}",
          issueId as string
        )
      );
    }
  }, [issueId, selectedCluster]);

  // Reset selected span on incident change
  useEffect(() => {
    setSelectedSpan(null);
  }, [incidentId]);

  // Fetch span data for the incident on mount
  useEffect(() => {
    if (router.isReady && incidentId === undefined) {
      router.push("/issues");
    }
    if (selectedCluster !== null && incidentId !== undefined) {
      fetchSpanData(
        LIST_SPANS_ENDPOINT.replace("{incident_id}", incidentId as string)
          .replace("{cluster_id}", selectedCluster)
          .replace("{issue_id}", issueId as string)
      );
    }
  }, [incidentId, router, selectedCluster]);

  // Minimize main drawer when span drawer is open
  useEffect(() => {
    if (isSpanDrawerOpen && !isDrawerMinimized) {
      dispatch(minimizeDrawer());
    }
  }, [isSpanDrawerOpen]);

  // Build and set the span tree on span change
  // Span tree is used to render the span drawer and has the entire router of the trace from the parent to the children
  const getSpans = () => {
    if (spanData == null) return [];
    const topKeys = Object.keys(spanData);
    let rootNode: null | SpanDetail = null;
    const formattedSpans: SpanDetail[] = [];
    for (let i = 0; i < topKeys.length; i++) {
      const key = topKeys[i];
      const span = { ...spanData[key], span_id: key, children: [] };
      if (!topKeys.includes(span.parent_span_id)) {
        rootNode = span;
      }
      formattedSpans.push(span);
    }
    if (rootNode != null) {
      setSpanTree(buildSpanTree(formattedSpans, rootNode));
    }
  };

  // Build the span tree on span data change
  useEffect(() => {
    if (spanData != null) {
      getSpans();
      setSelectedSpan(Object.keys(spanData)[0]);
    }
  }, [spanData]);

  // Set the incident list on issue change
  useEffect(() => {
    if (issue != null) {
      dispatch(setIncidentList(issue.incidents));
    }
  }, [issue]);

  const renderSpanTree = (parentSpan: SpanDetail) => {
    const active = selectedSpan === parentSpan.span_id;
    return (
      <div className={styles["span-tree-container"]} key={nanoid()}>
        <SpanCard
          span={parentSpan}
          active={active}
          onClick={(selectedSpan) => {
            setSelectedSpan(selectedSpan.span_id as string);
          }}
        />
        {parentSpan.children !== undefined &&
          parentSpan.children.length > 0 &&
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
        {issueLoading || issue == null ? (
          <Skeleton className={"page-title-loader"} />
        ) : (
          <div
            className={cx(
              styles.header,
              isSticky && styles.sticky,
              isDrawerMinimized && styles["drawer-minimized"]
            )}
            id="incident-header"
            ref={stickyRef}
          >
            <div className={styles["header-left"]}>
              {" "}
              <h3>{getTitleFromIssue(issue.issue_title)}</h3>
              <IncidentMetadata incident={issue} />
            </div>
            <div className={styles["header-right"]}>
              <IncidentNavButtons />
            </div>
          </div>
        )}
      </div>
      <div
        className={cx(
          styles.container,
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
          {spanTree != null && (
            <SpanDetailDrawer isOpen={isSpanDrawerOpen}>
              <div className={styles["span-tree-container"]}>
                {renderSpanTree(spanTree)}
              </div>
            </SpanDetailDrawer>
          )}
          <ReactFlowProvider>
            <IncidentDetailMap
              isMinimized={isMapMinimized}
              toggleSize={toggleMapMinimized}
              spanData={spanData}
              spanTree={spanTree}
              onNodeClick={(spanId: string) => {
                if (spanId !== selectedSpan) {
                  setSelectedSpan(spanId);
                }
              }}
            />
          </ReactFlowProvider>
        </div>

        <div className={styles["incident-info-container"]}>
          <IncidentInfoTabs selectedSpan={selectedSpan} spanData={spanData} />
        </div>
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
