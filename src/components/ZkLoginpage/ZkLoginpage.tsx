import { SignIn } from "@clerk/nextjs";

import styles from "./ZkLoginpage.module.scss";

const ZkLoginpage = () => {
  return (
    <div className={styles.container}>
      <SignIn
        appearance={{
          elements: {
            footerAction: {
              display: "none",
            },
          },
        }}
      />
    </div>
  );
};

export default ZkLoginpage;
