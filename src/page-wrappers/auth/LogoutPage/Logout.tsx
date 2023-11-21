import AuthFormCard from "components/forms/AuthFormCard";
import AuthLayout from "components/layouts/AuthLayout";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect } from "react";
import { useDispatch } from "redux/store";
import { logoutUser } from "redux/thunks/auth";

const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logoutUser());
  }, []);
  return (
    <AuthFormCard title="Logout">
      {/* Head / Meta tags */}
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Logout</title>
        </Head>
      </Fragment>
      <h6>
        You&apos;re logged out. Click <Link href="/login">here</Link> to log in
        again.
      </h6>
    </AuthFormCard>
  );
};

Logout.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Logout;
