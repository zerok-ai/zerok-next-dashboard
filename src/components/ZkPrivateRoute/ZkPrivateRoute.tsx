import { RedirectToSignIn, useOrganization, useUser } from "@clerk/nextjs";
import PageSkeleton from "components/helpers/PageSkeleton";
import PageLayout from "components/layouts/PageLayout";
import { useEffect } from "react";

// import styles from "./ZkPrivateRoute.module.scss";

interface ZkPrivateRouteProps {
  children: React.ReactNode;
}

const ZkPrivateRoute = ({ children }: ZkPrivateRouteProps) => {
  const { isLoaded, isSignedIn } = useUser();
  const { organization } = useOrganization();
  console.log({ organization });
  useEffect(() => {
    const getMembers = async () => {
      const orgs = await organization?.getMemberships({
        limit: 1,
        offset: 1,
      });
      console.log({ orgs });
    };
    if (isSignedIn) {
      getMembers();
    }
  }, [isSignedIn]);
  if (!isLoaded) {
    return <PageSkeleton />;
  }
  if (!isSignedIn) {
    return <RedirectToSignIn redirectUrl={window.location.href} />;
  }

  return <PageLayout>{children}</PageLayout>;
};

export default ZkPrivateRoute;
