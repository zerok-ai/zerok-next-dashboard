import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const IntegrationSkipPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/integrations");
  }, []);
  return null;
};

IntegrationSkipPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default IntegrationSkipPage;
