"use client";
import cx from "classnames";
import IncidentChatTab from "components/chat/IncidentChatTab";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import SpanCards from "components/SpanCards";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { resetChat } from "redux/chat/chatSlice";
import { changeSelectedCluster } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";

// import { type SpanResponse } from "utils/types";
import styles from "./IncidentDetailPage.module.scss";
import { IssueMetadata } from "./IncidentDetails.utils";

const IncidentDetailPage = () => {
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetChat());
    };
  }, []);
  const { clusters } = useSelector((state) => state.cluster);
  const router = useRouter();
  const {
    query: { cluster_id },
  } = router;
  useEffect(() => {
    if (cluster_id && clusters.length > 0) {
      dispatch(changeSelectedCluster({ id: cluster_id }));
    }
  }, [cluster_id, clusters]);
  return (
    <Fragment>
      <Head>
        <title>ZeroK Dashboard | Incident Detail</title>
      </Head>
      <IssueMetadata />
      <div className={styles["content-container"]}>
        <section className={styles["chat-container"]}>
          <IncidentChatTab />
        </section>
        <section
          className={cx(
            styles["detail-container"],
            isScrollLocked && styles["lock-scroll"]
          )}
        >
          <SpanCards
            lockScroll={(val) => {
              setIsScrollLocked(val);
            }}
            isScrollLocked={isScrollLocked}
          />
        </section>
      </div>
    </Fragment>
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
