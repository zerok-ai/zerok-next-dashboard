"use client";
import cx from "classnames";
import ExceptionTab from "components/ExceptionCard";
import BackLink from "components/helpers/BackLink";
import IncidentChatTab from "components/IncidentChatTab";
import PageLayout from "components/layouts/PageLayout";
import PodCard from "components/PodCard";
import PrivateRoute from "components/PrivateRoute";
import TraceGroups from "components/TraceGroups";
import TraceTable from "components/TraceTable";
import TraceTree from "components/TraceTree";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { drawerSelector, toggleDrawer } from "redux/drawer";
import { useDispatch, useSelector } from "redux/store";
import { type TraceMetadataDetail } from "utils/issues/types";
import { type SpanResponse } from "utils/types";

// import { type SpanResponse } from "utils/types";
import styles from "./IncidentDetailPage.module.scss";
import { IssueMetadata } from "./IncidentDetails.utils";

const IncidentDetailPage = () => {
  const [chatTrace, setChatTrace] = useState<null | TraceMetadataDetail>(null);
  const [exceptionSpan, setExceptionSpan] = useState<null | string>(null);
  const [spans, setSpans] = useState<null | SpanResponse>(null);
  const [podTabs, setPodTabs] = useState<null | string[]>(null);
  const router = useRouter();
  const trace = router.query.trace;
  const issue_id = router.query.issue_id;
  const { isDrawerMinimized } = useSelector(drawerSelector);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   setExceptionSpan(null);
  // }, [router]);

  useEffect(() => {
    if (!isDrawerMinimized) {
      dispatch(toggleDrawer());
    }
  }, []);

  useEffect(() => {
    if (spans) {
      const memo = new Set<string>();
      Object.keys(spans).forEach((key) => {
        const span = spans[key];
        if (
          span.source &&
          !span.source.includes("zk-client") &&
          !memo.has(span.source)
        ) {
          memo.add(span.source);
        }
        if (
          span.destination &&
          !span.destination.includes("zk-client") &&
          !memo.has(span.destination)
        ) {
          memo.add(span.destination);
        }
      });
      setPodTabs(Array.from(memo));
    }
  }, [spans]);

  return (
    <div>
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Incident Detail</title>
        </Head>
      </Fragment>
      <div className="page-title">
        <IssueMetadata />
      </div>
      <div className={styles["content-container"]}>
        <div className={styles["chat-container"]}>
          <IncidentChatTab />
        </div>
        <div className={styles["detail-container"]}>
          {trace && (
            <BackLink
              onBack={() => {
                const old = router.query;
                delete old.trace;
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...old,
                  },
                });
              }}
              title="Back to traces"
            />
          )}
          {trace ? (
            <div className={styles["tree-wrapper"]}>
              <div className={styles["cards-container"]}>
                <div
                  className={cx(
                    styles["tree-container"],
                    exceptionSpan && styles["tree-container-minimal"]
                  )}
                >
                  <TraceTree
                    updateSpans={(spans: SpanResponse) => {
                      setSpans(spans);
                    }}
                    updateExceptionSpan={(id: string) => {
                      setExceptionSpan(id);
                    }}
                  />
                </div>
                {exceptionSpan && (
                  <div className={styles["exception-container"]}>
                    <ExceptionTab spanKey={exceptionSpan} />
                  </div>
                )}
                <div className={styles["pod-container"]}>
                  <PodCard services={podTabs} />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles["table-container"]}>
              {/* <TraceTable
                updateChatTrace={(trace) => {
                  if (!chatTrace) {
                    setChatTrace(trace);
                  }
                }}
              /> */}
              {issue_id ? (
                <div>
                  {/* <BackLink
                    title="Back"
                    onBack={() => {
                      const old = router.query;
                      delete old.issue_id;
                      router.push({
                        pathname: router.pathname,
                        query: old,
                      });
                    }}
                  /> */}
                  <TraceTable
                    updateChatTrace={(trace) => {
                      if (!chatTrace) {
                        setChatTrace(trace);
                      }
                    }}
                  />
                </div>
              ) : (
                <TraceGroups />
              )}
            </div>
          )}
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
