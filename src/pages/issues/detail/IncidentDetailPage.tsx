"use client";
import IncidentChatTab from "components/chat/IncidentChatTab";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import SpanCards from "components/SpanCards";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import { chatSelector, fetchPastEvents, resetChat } from "redux/chat";
import { clusterSelector } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";

// import { type SpanResponse } from "utils/types";
import styles from "./IncidentDetailPage.module.scss";
import { IssueMetadata } from "./IncidentDetails.utils";

const IncidentDetailPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { history } = useSelector(chatSelector);
  const { selectedCluster } = useSelector(clusterSelector);
  useEffect(() => {
    const { issue_id: issueId } = router.query;
    if (!history.length && selectedCluster && issueId) {
      dispatch(
        fetchPastEvents({
          issueId: issueId as string,
          selectedCluster,
        })
      );
    }
    return () => {
      dispatch(resetChat());
    };
  }, [selectedCluster]);
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
          <SpanCards />
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
