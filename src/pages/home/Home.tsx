import PrivateRoute from "components/PrivateRoute";
import styles from "./Home.module.scss";
import PageLayout from "components/PageLayout";
import { Fragment } from "react";
import Head from "next/head";

const Home = () => {
  return <div>
    <Fragment>
      <Head>
        <title>ZeroK Dashboard | Home page</title>
        </Head>
      </Fragment>
      <h1>hey</h1>
    </div>;
};

Home.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default Home;
