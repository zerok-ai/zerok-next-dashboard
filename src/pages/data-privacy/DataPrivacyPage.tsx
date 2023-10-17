import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import Head from "next/head";
import { Fragment } from "react";

// import styles from "./DataPrivacyPage.module.scss";

const DataPrivacyPage = () => {
  return (
    <Fragment>
      <PageHeader
        title="Data Obfuscation"
        showRange={false}
        showRefresh={false}
      />
    </Fragment>
  );
};

DataPrivacyPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | API Keys</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default DataPrivacyPage;
