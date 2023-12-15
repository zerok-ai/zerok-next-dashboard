import ZkPrivateRoute from "components/ZkPrivateRoute";
import IssuesListPage from "page-wrappers/issues/IssuesListPage";

const Page = () => {
  return (
    <ZkPrivateRoute>
      <IssuesListPage />
    </ZkPrivateRoute>
  );
};

export default Page;
