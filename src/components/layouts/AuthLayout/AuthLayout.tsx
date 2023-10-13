import { Fragment } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <Fragment>{children}</Fragment>;
};

export default AuthLayout;
