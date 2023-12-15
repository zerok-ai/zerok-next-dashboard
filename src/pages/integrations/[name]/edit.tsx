import ZkPrivateRoute from "components/ZkPrivateRoute";
import IntegrationEditPage from "page-wrappers/integrations/IntegrationEditPage";

const Page = () => {
  return (
    <ZkPrivateRoute>
      <IntegrationEditPage />
    </ZkPrivateRoute>
  );
};

export default Page;
