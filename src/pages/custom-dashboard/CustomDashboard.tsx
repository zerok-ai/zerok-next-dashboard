import PrivateRoute from "components/PrivateRoute";
import styles from "./CustomDashboard.module.scss";
import Head from "next/head";
import PageLayout from "components/layouts/PageLayout";
import UnderConstruction from "components/UnderConstruction";

const CustomDashboard = () => {
  return <div>CustomDashboard</div>;
};

CustomDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Custom Dashboard</title>
      </Head>
      <PageLayout>
        <UnderConstruction />
      </PageLayout>
    </PrivateRoute>
  );
};

export default CustomDashboard;
