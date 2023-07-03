import PrivateRoute from "components/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import  Head from "next/head";
import styles from "./Users.module.scss";

const Users = () => {
  return <div>Users</div>;
};

Users.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Users</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};


export default Users;
