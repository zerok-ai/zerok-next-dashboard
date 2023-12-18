import ZkPrivateRoute from "components/ZkPrivateRoute";
import ZkUsersListPage from "page-wrappers/users/ZkUsersListPage";

const Page = () => {
  return (
    <ZkPrivateRoute>
      <ZkUsersListPage />
    </ZkPrivateRoute>
  );
};

export default Page;
