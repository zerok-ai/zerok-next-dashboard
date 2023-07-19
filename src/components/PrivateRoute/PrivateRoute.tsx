import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { tokenLogin } from "redux/authSlice";
import { getClusters } from "redux/cluster";
import { useDispatch, useSelector } from "redux/store";
import { getLocalToken } from "utils/functions";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const auth = useSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { isLoggedIn, token } = auth;
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    // check if token exists and user is logged in
    if (isLoggedIn && token) {
      setIsAuthorized(true);
      dispatch(getClusters());
    }
    // if user isn't present, check the local storage
    const localToken = getLocalToken();
    if (localToken) {
      dispatch(tokenLogin({ token: localToken }));
      return;
    }

    // if not logged in AND no local token, push user to login screen.
    if (!token && !localToken) {
      router.push("/login");
    }
  }, [auth.isLoggedIn, auth.token, auth.loading]);

  useEffect(() => {
    if (auth.error) {
      router.push("/login");
    }
  }, [auth.error]);

  if (!isAuthorized) {
    // @TODO - make skeletons for these
    return <CircularProgress color="primary" />;
  }

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
