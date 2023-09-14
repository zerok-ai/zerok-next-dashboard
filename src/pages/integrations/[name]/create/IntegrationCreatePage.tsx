import PrometheusForm from "components/forms/PrometheusForm";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/maps/PrivateRoute";

import styles from "./IntegrationCreatePage.module.scss";

const IntegrationCreatePage = () => {
  return (
    <div className={styles.container}>
      <PrometheusForm edit={false} />
    </div>
  );
};

IntegrationCreatePage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default IntegrationCreatePage;
