import PrometheusForm from "components/forms/PrometheusForm";
import PageHeader from "components/helpers/PageHeader";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type GenericObject } from "utils/types";

import styles from "./IntegrationCreatePage.module.scss";

const PAGE_MAP: GenericObject = {
  prometheus: "Prometheus",
};

const TITLE_MAP: GenericObject = {
  prometheus: "Add a new Prometheus cluster",
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
  return (
    <div className={styles.container}>
      <PageHeader
        htmlTitle={page ? TITLE_MAP[name as string] : ""}
        title={page ? TITLE_MAP[name as string] : ""}
        loading={!page}
        showRange={false}
        showRefresh={false}
        showBreadcrumb={true}
      />
      <PrometheusForm />
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
