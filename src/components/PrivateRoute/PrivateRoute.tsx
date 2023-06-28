import { useDispatch, useSelector } from "redux/store";
import styles from "./PrivateRoute.module.scss";
import { useEffect, useState } from "react";
import Loader from "components/mantis/Loader";
import { CircularProgress } from "@mui/material";
import { getLocalToken } from "utils/functions";
import { loginUser, logoutUser, tokenLogin } from "redux/authSlice";
import { useRouter } from "next/router";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { auth } = useSelector((state) => state);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { isLoggedIn, token } = auth;
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    // check if token exists and user is logged in
    if (isLoggedIn && token) {
      setIsAuthorized(true);
      return;
    }
    // if user isn't present, check the local storage
    const localToken = getLocalToken();
    if (localToken) {
      dispatch(tokenLogin({ token: localToken }));
      return;
    }

    // if not logged in AND no local token, push user to login screen.
    console.log({ token, localToken, auth });
    if (!token && !localToken) {
      router.push("/login");
    }
  }, [auth.isLoggedIn, auth.token, auth.loading]);

  useEffect(() => {
    if (auth.error) {
      router.push("/");
    }
  }, [auth.error]);
  console.log({ auth });
  if (!isAuthorized) {
    return <CircularProgress color="primary" />;
  }

  return children;
};

export default PrivateRoute;
