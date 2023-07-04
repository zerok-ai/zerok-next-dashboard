import AuthLayout from "components/layouts/AuthLayout";
import styles from "./ForgotPassword.module.scss";
import AuthFormCard from "components/forms/AuthFormCard";
import { Fragment } from "react";
import Head from "next/head";
import ResetPasswordForm from "components/forms/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <div>
      {/* Head / Meta tags */}
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Reset Password</title>
        </Head>
      </Fragment>
      <AuthFormCard title="Reset password">
        <ResetPasswordForm />
      </AuthFormCard>
    </div>
  );
};

ResetPassword.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ResetPassword;
