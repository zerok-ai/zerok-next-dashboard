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
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { clusterSelector } from "redux/cluster";
import { drawerSelector, minimizeDrawer } from "redux/drawer";
import { setIncidentList } from "redux/incidentList";
import { useDispatch, useSelector } from "redux/store";
import { GET_ISSUE_ENDPOINT, LIST_SPANS_ENDPOINT } from "utils/endpoints";
import { type IssueDetail, type SpanResponse } from "utils/types";

import styles from "./IncidentDetailPage.module.scss";
import {
  IncidentMetadata,
  SpanDetailDrawer,
  SpanDrawerButton,
} from "./IncidentDetails.utils";

const spanTransformer = (spanData: SpanResponse) => {
  const formattedSpans: SpanResponse = {};
  const topKeys = Object.keys(spanData);
  topKeys.map((key) => {
    const span = spanData[key];
    // find root node
    if (!topKeys.includes(span.parent_span_id)) {
      span.root = true;
    }
    // check for exception span
    if (span.destination.includes("zk-client")) {
      formattedSpans[key] = { ...span, span_id: key, exception: true };
      // find it's parent
      Object.keys(spanData).map((key) => {
        const parentSpan = spanData[key];
        if (span.source === spanData[key].source) {
          formattedSpans[key] = {
            ...parentSpan,
            span_id: key,
            exceptionParent: true,
          };
        }
        return true;
      });
    } else {
      // check if span already exists, so as to not override exception span
      if (!formattedSpans[key]) {
        formattedSpans[key] = { ...span, span_id: key };
      }
    }
    return true;
  });
  return formattedSpans;
};

const IncidentDetailPage = () => {
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const { selectedCluster } = useSelector(clusterSelector);
  const dispatch = useDispatch();
  // Issue metadata - title,description,time etc
  const { data: issue, fetchData } = useFetch<IssueDetail>("issue");

  // Span data - overviews of each of the spans for this incident ID
  const {
    data: spanData,
    fetchData: fetchSpanData,
    setData: setSpanData,
  } = useFetch<SpanResponse>("spans", null, spanTransformer);

  // Selected span - which span is currently selected, used for fetching raw data to show in the infotabs
  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);

  const router = useRouter();

  const incidentId = router.query.incident;
  const issueId = router.query.issue;

  const [isMapMinimized, setIsMapMinimized] = useState(true);
  const toggleMapMinimized = () => {
    setIsMapMinimized(!isMapMinimized);
  };

  const [isSpanDrawerOpen, setIsSpanDrawerOpen] = useState(false);
  const toggleSpanDrawer = () => {
    setIsSpanDrawerOpen(!isSpanDrawerOpen);
  };

  // const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  // Fetch issue data on mount
  useEffect(() => {
    if (issueId !== undefined && selectedCluster !== null) {
      fetchData(
        GET_ISSUE_ENDPOINT.replace("{cluster_id}", selectedCluster).replace(
          "{issue_id}",
          issueId as string
        )
      );
    }
  }, [issueId, selectedCluster]);

  // Reset selected span on incident change
  useEffect(() => {
    if (selectedSpan) {
      setSelectedSpan(null);
      setSpanData(null);
    }
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
  // Build the span tree on span data change
  useEffect(() => {
    if (spanData != null) {
      setSelectedSpan(
        Object.keys(spanData).filter((key) => {
          const span = spanData[key];
          const { source, destination, protocol } = span;
          return (
            source &&
            destination &&
            protocol &&
            !destination.includes("zk-client")
          );
        })[0]
      );
    }
  }, [spanData]);

  // Set the incident list on issue change
  useEffect(() => {
    if (issue != null) {
      dispatch(setIncidentList(issue.incidents));
    }
  }, [issue]);

  const renderSpans = () => {
    if (spanData == null) return null;
    return Object.keys(spanData).map((key) => {
      const span = spanData[key];
      const active = span.span_id === selectedSpan;
      if (span.destination.includes("zk-client")) {
        return null;
      }
      return (
        <div className={styles["span-tree-container"]} key={nanoid()}>
          <SpanCard
            span={span}
            active={active}
            onClick={(selectedSpan) => {
              setSelectedSpan(selectedSpan.span_id as string);
            }}
          />{" "}
        </div>
      );
    });
  };

  return (
    <div>
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Incident Detail</title>
        </Head>
      </Fragment>
      <div className="page-title">
        {issue ? (
          <IncidentMetadata issue={issue} />
        ) : (
          <Skeleton className={"page-title-loader"} />
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
          {spanData && (
            <SpanDetailDrawer isOpen={isSpanDrawerOpen}>
              <div className={styles["span-tree-container"]}>
                {renderSpans()}
              </div>
            </SpanDetailDrawer>
          )}
          <ReactFlowProvider>
            <IncidentDetailMap
              isMinimized={isMapMinimized}
              toggleSize={toggleMapMinimized}
              spanData={spanData}
              onNodeClick={(
                sourceId: string,
                source: string | null = null,
                destination: string | null = null
              ) => {
                if (!spanData) return;
                const old = selectedSpan;
                if (!source && !destination) {
                  const span = Object.keys(spanData).find((key) => {
                    if (key !== selectedSpan) {
                      const span = spanData[key];
                      return span.source === sourceId;
                    }
                    return false;
                  });
                  setSelectedSpan(span ?? old);
                } else if (!destination) {
                  const span = Object.keys(spanData).find(
                    (key) => spanData[key].source === source
                  );
                  setSelectedSpan(span ?? old);
                } else if (source && destination) {
                  const span = Object.keys(spanData).find(
                    (key) =>
                      spanData[key].source === source &&
                      spanData[key].destination === destination
                  );
                  setSelectedSpan(span ?? old);
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
