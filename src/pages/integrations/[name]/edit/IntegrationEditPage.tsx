import CustomSkeleton from "components/custom/CustomSkeleton";
import PrometheusForm from "components/forms/PrometheusForm";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type GenericObject } from "utils/types";

import styles from "./IntegrationEditPage.module.scss";

const PAGE_MAP: GenericObject = {
  prometheus: <PrometheusForm edit={true} />,
};

const IntegrationEditPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const [page, setPage] = useState<string | null>(null);
  useEffect(() => {
    if (router.isReady && PAGE_MAP[name as string]) {
      setPage(name as string);
    }
  }, [router]);

  return (
    <div className={styles.container}>
      {page ? PAGE_MAP[page] : <CustomSkeleton len={10} />}
    </div>
  );
};

IntegrationEditPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default IntegrationEditPage;
