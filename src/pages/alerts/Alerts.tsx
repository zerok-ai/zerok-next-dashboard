import PrivateRoute from "components/PrivateRoute";
import styles from "./Alerts.module.scss";
import Head from "next/head";
import PageLayout from "components/layouts/PageLayout";
import UnderConstruction from "components/UnderConstruction";

const Alerts = () => {
  return <div>Alerts</div>;
};

Alerts.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Live Traces</title>
      </Head>
      <PageLayout>
        <UnderConstruction />
      </PageLayout>
    </PrivateRoute>
  );
};

export default Alerts;
