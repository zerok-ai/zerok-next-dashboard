import AuthFormCard from "components/forms/AuthFormCard";
import ResetPasswordForm from "components/forms/ResetPasswordForm";
import AuthLayout from "components/layouts/AuthLayout";
import Head from "next/head";
import { Fragment } from "react";

const ResetPassword = () => {
  return (
    <div>
      {/* Head / Meta tags */}
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Reset Password</title>
        </Head>
      </Fragment>
      <AuthFormCard title="Set new password">
        <ResetPasswordForm />
      </AuthFormCard>
    </div>
  );
};

ResetPassword.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ResetPassword;
