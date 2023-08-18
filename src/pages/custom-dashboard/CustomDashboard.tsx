import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import UnderConstruction from "components/UnderConstruction";
import Head from "next/head";

// import styles from "./CustomDashboard.module.scss";

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
