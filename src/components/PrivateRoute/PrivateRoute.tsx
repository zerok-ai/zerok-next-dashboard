import { useDispatch, useSelector } from "redux/store";
import styles from "./PrivateRoute.module.scss";
import { Fragment, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { getLocalToken } from "utils/functions";
import { tokenLogin } from "redux/authSlice";
import { useRouter } from "next/router";
import { getClusters } from "redux/cluster";
import { getApiKeys } from "redux/apiKeys";

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
      dispatch(getApiKeys())
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
      router.push("/");
    }
  }, [auth.error]);

  if (!isAuthorized) {
    return <CircularProgress color="primary" />;
  }

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
