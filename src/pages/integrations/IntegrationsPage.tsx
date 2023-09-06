import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";

import styles from "./IntegrationsPage.module.scss";

const IntegrationsPage = () => {
  return (
    <div className={styles.container}>
      <PageHeader
        title="Integrations"
        htmlTitle="Integrations"
        showRange={false}
        showRefresh={false}
        showBreadcrumb={false}
      />
    </div>
  );
};

IntegrationsPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default IntegrationsPage;
