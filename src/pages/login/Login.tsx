"use client";
import { Fragment } from "react";
import AuthLayout from "components/layouts/AuthLayout";
import Head from "next/head";
import LoginForm from "components/forms/LoginForm";
import AuthFormCard from "components/forms/AuthFormCard";

const Login = () => {
  return (
    <div>
      {/* Head / Meta tags */}
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Login</title>
        </Head>
      </Fragment>
      {/* Auth login form */}
      <AuthFormCard title="Login">
        <LoginForm />
      </AuthFormCard>
    </div>
  );
};

Login.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
