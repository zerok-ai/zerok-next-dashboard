import IncidentChatTab from "components/IncidentChatTab";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import TraceTable from "components/TraceTable";
import TraceTree from "components/TraceTree";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment } from "react";

// import { type SpanResponse } from "utils/types";
import styles from "./IncidentDetailPage.module.scss";
import { IssueMetadata } from "./IncidentDetails.utils";

// const spanTransformer = (spanData: SpanResponse) => {
//   const formattedSpans: SpanResponse = {};
//   const topKeys = Object.keys(spanData);
//   topKeys.map((key) => {
//     const span = spanData[key];
//     // find root node
//     if (!topKeys.includes(span.parent_span_id)) {
//       span.root = true;
//     }
//     // check for exception span
//     if (span.destination.includes("zk-client")) {
//       formattedSpans[key] = { ...span, span_id: key, exception: true };
//       // find it's parent
//       Object.keys(spanData).map((key) => {
//         const parentSpan = spanData[key];
//         if (span.source === spanData[key].source) {
//           formattedSpans[key] = {
//             ...parentSpan,
//             span_id: key,
//             exceptionParent: true,
//           };
//         }
//         return true;
//       });
//     } else {
//       // check if span already exists, so as to not override exception span
//       if (!formattedSpans[key]) {
//         formattedSpans[key] = { ...span, span_id: key };
//       }
//     }
//     return true;
//   });
//   return formattedSpans;
// };

const IncidentDetailPage = () => {
  const router = useRouter();
  const { trace } = router.query;
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
          {!trace ? <TraceTable /> : <TraceTree />}
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
