import BackLink from "components/helpers/BackLink";
import IncidentChatTab from "components/IncidentChatTab";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import TraceTable from "components/TraceTable";
import TraceTree from "components/TraceTree";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { type TraceMetadataDetail } from "utils/issues/types";

// import { type SpanResponse } from "utils/types";
import styles from "./IncidentDetailPage.module.scss";
import { IssueMetadata } from "./IncidentDetails.utils";

const IncidentDetailPage = () => {
  const [chatTrace, setChatTrace] = useState<null | TraceMetadataDetail>(null);
  const [selectedTrace, setSelectedTrace] =
    useState<null | TraceMetadataDetail>(null);
  const router = useRouter();
  const trace = router.query.trace;
  console.log({ chatTrace });
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
          <IncidentChatTab trace={chatTrace?.incident_id ?? null} />
        </div>
        <div className={styles["detail-container"]}>
          {trace && selectedTrace ? (
            <div className={styles["tree-wrapper"]}>
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
                title={selectedTrace.entry_path}
              />
              <div className={styles["tree-container"]}>
                <TraceTree />
              </div>
            </div>
          ) : (
            <div className={styles["table-container"]}>
              <TraceTable
                updateChatTrace={(trace) => {
                  if (!chatTrace) {
                    setChatTrace(trace);
                  }
                }}
                updateSelectedTrace={(trace) => {
                  setSelectedTrace(trace);
                }}
              />
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
