import PrivateRoute from "components/PrivateRoute";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <PrivateRoute>
      <div>Home</div>
    </PrivateRoute>
  );
};

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <PrivateRoute>{page}</PrivateRoute>;
};

export default Home;
