import ProbeCreateForm from "components/forms/ProbeCreateForm";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import ValidClusterWrapper from "components/ValidClusterWrapper";
import Head from "next/head";
import { Fragment } from "react";

const Probes = () => {
  return (
    <Fragment>
      <PageHeader
        showRange={false}
        title="Create a new probe"
        showRefresh={false}
        showBreadcrumb
      />
      <ValidClusterWrapper>
        <ProbeCreateForm edit={false} />
      </ValidClusterWrapper>
    </Fragment>
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
