import PrivateRoute from "components/PrivateRoute";
import styles from "./Home.module.scss";
import PageLayout from "components/layouts/PageLayout";
import { Fragment } from "react";
import Head from "next/head";

const IncidentsPage = () => {
  return <div>
    <Fragment>
      <Head>
        <title>ZeroK Dashboard | Incidents Page</title>
        </Head>
      </Fragment>
      <h1>hey</h1>
    </div>;
};

IncidentsPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default IncidentsPage;
