import PrivateRoute from "components/PrivateRoute";
import styles from "./IncidentDetailPage.module.scss";
import PageLayout from "components/layouts/PageLayout";
import { Fragment } from "react";
import Head from "next/head";

const IncidentDetailPage = () => {
  return (
    <div>
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Incident Detail</title>
        </Head>
      </Fragment>
      <h3 className="page-title">Exception checkout</h3>
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
