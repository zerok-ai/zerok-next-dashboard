import PrivateRoute from "components/PrivateRoute";
import styles from "./RawTraces.module.scss";
import Head from "next/head";
import PageLayout from "components/layouts/PageLayout";
import UnderConstruction from "components/UnderConstruction";

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
