"use client";
import { Skeleton } from "@mui/material";
import IncidentChatTab from "components/IncidentChatTab";
import IncidentDetailTab from "components/IncidentDetailTab";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import { useFetch } from "hooks/useFetch";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { setIncidentList } from "redux/incidentList";
import { useDispatch, useSelector } from "redux/store";
import { GET_ISSUE_ENDPOINT, LIST_SPANS_ENDPOINT } from "utils/endpoints";
import { type IssueDetail, type SpanResponse } from "utils/types";

import styles from "./IncidentDetailPage.module.scss";
import { IncidentMetadata } from "./IncidentDetails.utils";

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

  // const [spanTree, setSpanTree] = useState<SpanDetail | null>(null);

  // Fetch issue data on mount
  useEffect(() => {
    if (issueId !== undefined && selectedCluster) {
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
    if (selectedCluster && incidentId !== undefined) {
      fetchSpanData(
        LIST_SPANS_ENDPOINT.replace("{incident_id}", incidentId as string)
          .replace("{cluster_id}", selectedCluster)
          .replace("{issue_id}", issueId as string)
      );
    }
  }, [incidentId, router, selectedCluster]);

  // Set the selected span to an appropriate span
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
      <div className={styles["content-container"]}>
        <div className={styles["chat-container"]}>
          <IncidentChatTab />
        </div>
        <div className={styles["detail-container"]}>
          <IncidentDetailTab
            spanData={spanData}
            selectedSpan={selectedSpan}
            onSpanChange={(spanId: string) => {
              setSelectedSpan(spanId);
            }}
          />
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
