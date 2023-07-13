"use client";
import PrivateRoute from "components/PrivateRoute";
import styles from "./IncidentDetailPage.module.scss";
import PageLayout from "components/layouts/PageLayout";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import Head from "next/head";
import { useFetch } from "hooks/useFetch";
import { IssueDetail, SpanDetail, SpanResponse } from "utils/types";
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
import { GET_ISSUE_ENDPOINT, LIST_SPANS_ENDPOINT } from "utils/endpoints";
import SpanCard from "components/SpanCard";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "redux/store";
import { drawerSelector, minimizeDrawer } from "redux/drawer";
import { ReactFlowProvider } from "reactflow";
import { setIncidentList } from "redux/incidentList";
import { clusterSelector } from "redux/cluster";
import IncidentInfoTabs from "components/IncidentInfoTabs";

const IncidentDetailPage = () => {
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const { selectedCluster } = useSelector(clusterSelector);
  const dispatch = useDispatch();
  const {
    loading: issueLoading,
    error: incidentError,
    data: issue,
    fetchData: fetchIssueData,
  } = useFetch<IssueDetail>("issue");

  const {
    loading: spanLoading,
    error: spanError,
    data: spanData,
    fetchData: fetchSpanData,
    setData: setSpanData,
  } = useFetch<SpanResponse>("spans");

  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);

  const router = useRouter();
  const incidentId = router.query.id;
  const issueId = router.query.issue_id;

  const [isMapMinimized, setIsMapMinimized] = useState(true);
  const toggleMapMinimized = () => setIsMapMinimized(!isMapMinimized);

  const [isSpanDrawerOpen, setIsSpanDrawerOpen] = useState(false);
  const toggleSpanDrawer = () => setIsSpanDrawerOpen(!isSpanDrawerOpen);

  const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const stickyHeader = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const mainHeader = document.getElementById("incident-header");
    let fixedTop = stickyHeader.current?.offsetTop;
    const fixedHeader = () => {
      if (mainHeader && stickyHeader.current && fixedTop) {
        if (window.pageYOffset > fixedTop + mainHeader.offsetHeight) {
          setIsHeaderSticky(true);
        } else {
          setIsHeaderSticky(false);
        }
      }
    };
    window.addEventListener("scroll", fixedHeader);
    return () => window.removeEventListener("scroll", fixedHeader);
  }, []);

  useEffect(() => {
    if (issueId && selectedCluster) {
      fetchIssueData(
        GET_ISSUE_ENDPOINT.replace(
          "{cluster_id}",
          selectedCluster as string
        ).replace("{issue_id}", issueId as string)
      );
    }
  }, [issueId, selectedCluster]);

  useEffect(() => {
    setSelectedSpan(null);
  }, [incidentId]);

  useEffect(() => {
    if (router.isReady && !incidentId) {
      router.push("/issues");
    }
    if (selectedCluster && incidentId) {
      fetchSpanData(
        LIST_SPANS_ENDPOINT.replace("{incident_id}", incidentId as string)
          .replace("{cluster_id}", selectedCluster as string)
          .replace("{issue_id}", issueId as string)
      );
    }
  }, [incidentId, router, selectedCluster]);

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
    if (spanData) {
      setSelectedSpan(Object.keys(spanData)[0]);
    }
  }, [spanData]);

  useEffect(() => {
    if (issue) {
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
          onClick={(selectedSpan) =>
            setSelectedSpan(selectedSpan.span_id as string)
          }
        />
        {!!parentSpan.children?.length &&
          parentSpan.children.map((span) => renderSpanTree(span))}
      </div>
    );
  };
  console.log({ isHeaderSticky });
  return (
    <div>
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Incident Detail</title>
        </Head>
      </Fragment>
      <div className="page-title">
        {issueLoading || !issue ? (
          <Skeleton className={"page-title-loader"} />
        ) : (
          <div
            className={cx(styles["header"], isHeaderSticky && styles["sticky"])}
            id="incident-header"
            ref={stickyHeader}
          >
            <div className={styles["header-left"]}>
              {" "}
              <h3>{issue.issue_title}</h3>
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
          <ReactFlowProvider>
            <IncidentDetailMap
              isMinimized={isMapMinimized}
              toggleSize={toggleMapMinimized}
              spanData={spanData}
              spanTree={spanTree}
              onNodeClick={(spanId: string) => {
                if (spanId !== selectedSpan) {
                  setSelectedSpan(spanId as string);
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
