import cx from "classnames";
import IncidentChatTab from "components/chat/IncidentChatTab";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import SpanCards from "components/SpanCards";
import { useZkFlag } from "hooks/useZkFlag";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import { resetChat } from "redux/chat/chatSlice";
import { changeSelectedCluster } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";

import IssueMetadata from "./helpers/IssueDetailPageHeader";
import styles from "./IssueDetailPage.module.scss";

const IssueDetailPage = () => {
  const dispatch = useDispatch();

  const zkChatEnabled = useZkFlag("org", "gpt", "zkchat");

  // reset chat on navigating away from this page so that the history is not persisted
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

  // for slack integration - fetch and set the cluster id if present & different from the current one
  useEffect(() => {
    if (cluster_id && clusters.length > 0) {
      dispatch(changeSelectedCluster({ id: cluster_id }));
    }
  }, [cluster_id, clusters]);

  return (
    <Fragment>
      {/* Title, times and metadata */}
      <IssueMetadata />
      {/* content */}
      <div className={styles["content-container"]}>
        <section className={styles["chat-section"]}>
          <IncidentChatTab enabled={zkChatEnabled.enabled} />
        </section>
        <section
          className={cx(
            styles["cards-section"]
            // isScrollLocked && styles["lock-scroll"]
          )}
        >
          <SpanCards chatEnabled={zkChatEnabled.enabled} />
        </section>
      </div>
    </Fragment>
  );
};

IssueDetailPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default IssueDetailPage;
