import AuthFormCard from "components/forms/AuthFormCard";
import ForgotPasswordForm from "components/forms/ForgotPasswordForm";
import AuthLayout from "components/layouts/AuthLayout";
import Head from "next/head";
import { Fragment } from "react";

// import styles from "./ForgotPassword.module.scss";

const ForgotPassword = () => {
  return (
    <Fragment>
      <Head>
        <title>ZeroK Dashboard | Forgot Password</title>
      </Head>
      <AuthFormCard title="Forgot password">
        <ForgotPasswordForm />
      </AuthFormCard>
    </Fragment>
  );
};

ForgotPassword.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ForgotPassword;
