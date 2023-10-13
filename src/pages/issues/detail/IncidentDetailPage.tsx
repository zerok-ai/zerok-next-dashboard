"use client";
import cx from "classnames";
import IncidentChatTab from "components/chat/IncidentChatTab";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import SpanCards from "components/SpanCards";
import Head from "next/head";
import { Fragment, useState } from "react";

// import { type SpanResponse } from "utils/types";
import styles from "./IncidentDetailPage.module.scss";
import { IssueMetadata } from "./IncidentDetails.utils";

const IncidentDetailPage = () => {
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   return () => {
  //     dispatch(resetChat());
  //   };
  // }, []);
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
