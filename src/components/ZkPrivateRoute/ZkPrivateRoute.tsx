import {
  RedirectToSignIn,
  useOrganization,
  useOrganizationList,
  useUser,
} from "@clerk/nextjs";
import PageSkeleton from "components/helpers/PageSkeleton";
import PageLayout from "components/layouts/PageLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getClusters } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";

// import styles from "./ZkPrivateRoute.module.scss";

interface ZkPrivateRouteProps {
  children: React.ReactNode;
  isClusterRoute?: boolean;
}

const ZkPrivateRoute = ({ children, isClusterRoute }: ZkPrivateRouteProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { organization } = useOrganization();
  const [orgLoaded, setOrgLoaded] = useState(false);
  const { initialized, loading: clusterLoading } = useSelector(
    (state) => state.cluster
  );
  const { setActive } = useOrganizationList();
  const router = useRouter();
  const dispatch = useDispatch();
  const setUserOrg = async () => {
    try {
      const orgs = await user?.getOrganizationMemberships();
      if (orgs && orgs.length > 0 && setActive) {
        const org = orgs[0];
        setActive({ organization: org.organization.id });
      }
    } catch (err) {
      router.push("/logout");
    }
  };
  useEffect(() => {
    if (isSignedIn) {
      if (organization) {
        setOrgLoaded(true);
        if (isClusterRoute && !clusterLoading && !initialized) {
          console.log("HEY");
          dispatch(getClusters());
        }
      } else {
        setOrgLoaded(false);
        setUserOrg();
      }
    }
  }, [isSignedIn, orgLoaded, organization, isClusterRoute]);

  if (!isLoaded) {
    return <PageSkeleton />;
  }
  if (!isSignedIn) {
    return <RedirectToSignIn redirectUrl={window.location.href} />;
  }

  if (isSignedIn && orgLoaded) {
    return <PageLayout>{children}</PageLayout>;
  }

  return <PageSkeleton />;
};

export default ZkPrivateRoute;
