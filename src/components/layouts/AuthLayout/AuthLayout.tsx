import { ChildrenType } from "utils/types";
import styles from "./AuthLayout.module.scss";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default AuthLayout;