import AuthFormCard from "components/forms/AuthFormCard";
import ResetPasswordForm from "components/forms/ResetPasswordForm";
import AuthLayout from "components/layouts/AuthLayout";
import Head from "next/head";
import { Fragment } from "react";

const ResetPassword = () => {
  return (
    <Fragment>
      <Head>
        <title>ZeroK Dashboard | Reset Password</title>
      </Head>
      <AuthFormCard title="Set new password">
        <ResetPasswordForm />
      </AuthFormCard>
    </Fragment>
  );
};

ResetPassword.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ResetPassword;
