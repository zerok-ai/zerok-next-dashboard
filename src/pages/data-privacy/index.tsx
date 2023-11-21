import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import Head from "next/head";
import DataObfuscationPage from "page-wrappers/DataObfuscationPage";

const DataPrivacyPage = () => {
  return <DataObfuscationPage />;
};

DataPrivacyPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Data Obfuscation</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default DataPrivacyPage;
