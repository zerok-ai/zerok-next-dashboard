import PrometheusForm from "components/forms/PrometheusForm";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type GenericObject } from "utils/types";

import styles from "./IntegrationCreatePage.module.scss";

const PAGE_MAP: GenericObject = {
  prometheus: "Prometheus",
};

const IntegrationCreatePage = () => {
  const router = useRouter();
  const { name } = router.query;
  const [page, setPage] = useState<null | string>(null);
  useEffect(() => {
    if (router.isReady && PAGE_MAP[name as string]) {
      setPage(PAGE_MAP[name as string]);
    }
  }, [router]);
  console.log({ page });
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
