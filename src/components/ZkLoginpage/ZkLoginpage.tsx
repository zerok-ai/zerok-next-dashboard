import { SignIn } from "@clerk/nextjs";

import styles from "./ZkLoginpage.module.scss";

const ZkLoginpage = () => {
  return (
    <div className={styles.container}>
      <SignIn />
    </div>
  );
};

export default ZkLoginpage;
