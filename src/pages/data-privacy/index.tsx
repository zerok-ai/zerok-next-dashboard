import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import DataObfuscationPage from "components/page-wrappers/DataObfuscationPage";
import Head from "next/head";

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
