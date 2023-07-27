import CreateNewIssueDrawer from "components/CreateNewIssueDrawer";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import Head from "next/head";

import styles from "./ClassifyPage.module.scss";

const ClassifyPage = () => {
  return (
    <div className={styles.container}>
      <h3 className="page-title">New Issue</h3>
      <h6>Define issue conditions:</h6>
      <div className={styles["form-container"]}>
        <CreateNewIssueDrawer />
      </div>
    </div>
  );
};

ClassifyPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Classify New Issue</title>
      </Head>
      <PageLayout hideRange={true}>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default ClassifyPage;
