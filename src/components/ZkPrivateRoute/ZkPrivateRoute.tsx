import { useUser } from "@clerk/nextjs";
import PageSkeleton from "components/helpers/PageSkeleton";
import PageLayout from "components/layouts/PageLayout";
import Link from "next/link";

// import styles from "./ZkPrivateRoute.module.scss";

interface ZkPrivateRouteProps {
  children: React.ReactNode;
}

const ZkPrivateRoute = ({ children }: ZkPrivateRouteProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  console.log({ user, isLoaded, isSignedIn });
  if (!isLoaded) {
    return <PageSkeleton />;
  }
  if (!isSignedIn) {
    return (
      <div>
        <h1>You are not signed in</h1>
        <Link href="/zk-login">Sign in here</Link>
      </div>
    );
  }

  return <PageLayout>{children}</PageLayout>;
};

export default ZkPrivateRoute;
