import PrometheusForm from "components/forms/PrometheusForm";
import ZkPrivateRoute from "components/ZkPrivateRoute";

import styles from "./IntegrationCreatePage.module.scss";

const IntegrationCreatePage = () => {
  return (
    <div className={styles.container}>
      <PrometheusForm edit={false} />
    </div>
  );
};

IntegrationCreatePage.getLayout = function getLayout(page: React.ReactNode) {
  return <ZkPrivateRoute isClusterRoute={true}>{page}</ZkPrivateRoute>;
};

export default IntegrationCreatePage;
