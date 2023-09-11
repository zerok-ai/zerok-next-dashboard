import UnderConstruction from "components/helpers/UnderConstruction";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/maps/PrivateRoute";
import Head from "next/head";

// import styles from "./Alerts.module.scss";

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
