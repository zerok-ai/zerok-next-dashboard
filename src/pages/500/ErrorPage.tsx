import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import UnderConstruction from "components/UnderConstruction";
import Head from "next/head";

const ErrorPage = () => {
  return (
    <PrivateRoute>
      <Head>
        <title>Something went wrong</title>
      </Head>
      <PageLayout>
        <UnderConstruction altTitle="Something went wrong, please try again." />
      </PageLayout>
    </PrivateRoute>
  );
};

export default ErrorPage;
