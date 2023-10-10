"use client";
import cx from "classnames";
import IncidentChatTab from "components/chat/IncidentChatTab";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import SpanCards from "components/SpanCards";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { resetChat } from "redux/chat";
import { useDispatch } from "redux/store";

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
        <div
          className={cx(
            styles["detail-container"],
            isScrollLocked && styles["lock-scroll"]
          )}
        >
          <SpanCards
            lockScroll={(val) => {
              setIsScrollLocked(val);
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
