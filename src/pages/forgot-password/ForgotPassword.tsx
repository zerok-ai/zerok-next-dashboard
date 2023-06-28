import AuthLayout from "components/layouts/AuthLayout";
import styles from "./ForgotPassword.module.scss";
import AuthFormCard from "components/AuthFormCard";
import { Fragment } from "react";
import ForgotPasswordForm from "components/ForgotPasswordForm";
import Head from "next/head";

const ForgotPassword = () => {
   return (
    <div>
      {/* Head / Meta tags */}
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Forgot Password</title>
        </Head>
      </Fragment>
      <AuthFormCard title="Reset password">
        <ForgotPasswordForm />
      </AuthFormCard>
    </div>
  );;
};


ForgotPassword.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};


export default ForgotPassword;
