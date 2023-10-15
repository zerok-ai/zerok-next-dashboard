import AuthFormCard from "components/forms/AuthFormCard";
import LoginForm from "components/forms/LoginForm";
import AuthLayout from "components/layouts/AuthLayout";
import Head from "next/head";
import { Fragment } from "react";

const Login = () => {
  return (
    <Fragment>
      <Head>
        <title>ZeroK Dashboard | Login</title>
      </Head>
      {/* Login Form */}
      <AuthFormCard title="Login">
        <LoginForm />
      </AuthFormCard>
    </Fragment>
  );
};

Login.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
