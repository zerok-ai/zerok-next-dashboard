import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import DataObfuscationPage from "components/page-wrappers/DataObfuscationPage";
import Head from "next/head";
import { useSelector } from "redux/store";

const DataPrivacyPage = () => {
  const { user } = useSelector((state) => state.auth);
  console.log({ user });
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
