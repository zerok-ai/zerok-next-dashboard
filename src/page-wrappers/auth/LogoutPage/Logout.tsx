import { useClerk } from "@clerk/nextjs";
import AuthFormCard from "components/forms/AuthFormCard";
import AuthLayout from "components/layouts/AuthLayout";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect } from "react";

const Logout = () => {
  const { signOut } = useClerk();
  useEffect(() => {
    signOut();
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
