import styles from "./UnderConstruction.module.scss";

const UnderConstruction = () => {
  return (
    <div className={styles.container}>
      <h3>
        This page is currently undergoing updates, please revisit at a later
        time for the latest information.
      </h3>
      {/* <LuConstruction className={styles.icon} /> */}
    </div>
  );
};

export default UnderConstruction;
