import CustomSkeleton from "components/custom/CustomSkeleton";
import PrivateRoute from "components/helpers/PrivateRoute";
import PrometheusTable from "components/integrations/PrometheusTable";
import SlackIntegration from "components/integrations/SlackIntegration";
import PageLayout from "components/layouts/PageLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type GenericObject } from "utils/types";

import styles from "./IntegrationsListPage.module.scss";

const PAGE_MAP: GenericObject = {
  prometheus: <PrometheusTable />,
  slack: <SlackIntegration />,
};

const IntegrationsListPage = () => {
  const router = useRouter();
  const [page, setPage] = useState<string | null>(null);
  useEffect(() => {
    if (router.query.name && PAGE_MAP[router.query.name as string]) {
      setPage(router.query.name as string);
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {page ? PAGE_MAP[page] : <CustomSkeleton len={15} />}
      </div>
    </div>
  );
};

IntegrationsListPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default IntegrationsListPage;
