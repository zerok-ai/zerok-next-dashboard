import ValidClusterWrapper from "components/clusters/ValidClusterWrapper";
import ProbeCreateForm from "components/forms/ProbeCreateForm";
import PageHeader from "components/helpers/PageHeader";
import ZkPrivateRoute from "components/ZkPrivateRoute";
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
    <ZkPrivateRoute isClusterRoute>
      <Head>
        <title>ZeroK Dashboard | Create a new probe</title>
      </Head>
      {page}
    </ZkPrivateRoute>
  );
};

export default Probes;
