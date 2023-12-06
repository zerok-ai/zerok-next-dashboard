import { SignUp } from "@clerk/nextjs";

import styles from "./ZkSignUpPage.module.scss";

const ZkSignupPage = () => {
  return (
    <div className={styles.container}>
      <SignUp />
    </div>
  );
};

export default ZkSignupPage;
