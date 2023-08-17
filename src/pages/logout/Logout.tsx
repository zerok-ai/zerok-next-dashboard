import AuthFormCard from "components/forms/AuthFormCard";
import Link from "next/link";
import { useEffect } from "react";
import { logoutUser } from "redux/authSlice";
import { useDispatch } from "redux/store";

const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logoutUser());
  }, []);
  return (
    <AuthFormCard title="Logout">
      <h6>
        You&apos;re logged out. Click <Link href="/login">here</Link> to log in
        again.
      </h6>
    </AuthFormCard>
  );
};

export default Logout;
