import ZkPrivateRoute from "components/ZkPrivateRoute";
import IssuesListPage from "page-wrappers/issues/IssuesListPage";

const Page = () => {
  return (
    <ZkPrivateRoute isClusterRoute={true}>
      <IssuesListPage />
    </ZkPrivateRoute>
  );
};

export default Page;
