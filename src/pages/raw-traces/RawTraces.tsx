import UnderConstruction from "components/helpers/UnderConstruction";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/maps/PrivateRoute";
import Head from "next/head";

// import styles from "./RawTraces.module.scss";

const RawTraces = () => {
  return <div>RawTraces</div>;
};

RawTraces.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Raw Traces</title>
      </Head>
      <PageLayout>
        <UnderConstruction />
      </PageLayout>
    </PrivateRoute>
  );
};

export default RawTraces;
