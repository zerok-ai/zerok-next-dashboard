import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import UnderConstruction from "components/UnderConstruction";
import Head from "next/head";

// import styles from "./LiveTraces.module.scss";

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
