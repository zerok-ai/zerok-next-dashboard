import {
  RedirectToSignIn,
  useOrganization,
  useOrganizationList,
  useUser,
} from "@clerk/nextjs";
import CreateClusterForm from "components/forms/CreateClusterForm";
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
  includeIntegrationModal?: boolean;
}

const ZkPrivateRoute = ({
  children,
  isClusterRoute,
  includeIntegrationModal = false,
}: ZkPrivateRouteProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { organization } = useOrganization();
  const [orgLoaded, setOrgLoaded] = useState(isSignedIn && !!organization);
  const dispatch = useDispatch();
  const { initialized, loading: clusterLoading } = useSelector(
    (state) => state.cluster
  );
  console.log({ organization });
  const { setActive } = useOrganizationList();
  const router = useRouter();
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
        if (!clusterLoading && !initialized) {
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
    return (
      <PageLayout>
        {children}
        {includeIntegrationModal && <CreateClusterForm />}
      </PageLayout>
    );
  }

  return <PageSkeleton />;
};

export default ZkPrivateRoute;
