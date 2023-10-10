import ProbeCreateForm from "components/forms/ProbeCreateForm";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import Head from "next/head";

import styles from "./Probes.module.scss";

const Probes = () => {
  return (
    <div className={styles.container}>
      <PageHeader
        showRange={false}
        title="Create a new probe"
        showRefresh={false}
        showBreadcrumb
      />
      <ProbeCreateForm edit={false} />
    </div>
  );
};

Probes.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Create a new probe</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default Probes;
