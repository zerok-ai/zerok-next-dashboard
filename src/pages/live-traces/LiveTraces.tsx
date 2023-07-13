import PrivateRoute from "components/PrivateRoute";
import styles from "./LiveTraces.module.scss";
import Head from "next/head";
import PageLayout from "components/layouts/PageLayout";
import UnderConstruction from "components/UnderConstruction";

const LiveTraces = () => {
  return <div>LiveTraces</div>;
};

LiveTraces.getLayout = function getLayout(page: React.ReactNode) {
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

export default LiveTraces;
