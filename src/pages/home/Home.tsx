import PrivateRoute from "components/PrivateRoute";
import styles from "./Home.module.scss";
import PageLayout from "components/PageLayout";

const Home = () => {
  return <div>Home</div>;
};

Home.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default Home;
