"use client";
import { Fragment, ReactElement } from "react";
import styles from "./Login.module.scss";
import AuthLayout from "components/layouts/AuthLayout";
import Head from "next/head";
import LoginForm from "components/LoginForm";

const Login = () => {
  return (
    <div>
      {/* Head / Meta tags */}
      <Fragment>
        <Head>
          <title>ZeroK Dashboard | Login</title>
        </Head>
      </Fragment>
      <main className={styles['form-container']}>
        <LoginForm />
      </main>
    </div>
  );
};

Login.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
