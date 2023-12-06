import ZkPrivateRoute from "components/ZkPrivateRoute";
import ZkUsersListPage from "components/ZkUsersListPage";

const Page = () => {
  return (
    <ZkPrivateRoute>
      <ZkUsersListPage />
    </ZkPrivateRoute>
  );
};

export default Page;
