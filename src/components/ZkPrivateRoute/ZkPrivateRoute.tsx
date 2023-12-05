import {
  LoginLink,
  LogoutLink,
  useKindeAuth,
} from "@kinde-oss/kinde-auth-nextjs";
import PageSkeleton from "components/helpers/PageSkeleton";
import PageLayout from "components/layouts/PageLayout";
import { useRouter } from "next/router";

interface ZkPrivateRouteProps {
  children: React.ReactNode;
}

const ZkPrivateRoute = ({ children }: ZkPrivateRouteProps) => {
  const { user, isLoading, isAuthenticated } = useKindeAuth();
  const router = useRouter();
  console.log({ user, router });
  if (isLoading) {
    return <PageSkeleton />;
  }
  if (isAuthenticated) {
    return <PageLayout>{children}</PageLayout>;
  } else {
    return (
      <PageLayout>
        <p>You must be logged in to access this.</p>
        <LoginLink>Login here</LoginLink>
        <LogoutLink>Logout here</LogoutLink>
      </PageLayout>
    );
  }
};

export default ZkPrivateRoute;
