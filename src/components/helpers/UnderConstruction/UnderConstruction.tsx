import styles from "./UnderConstruction.module.scss";

interface UnderConstructionProps {
  altTitle?: string;
}

const UnderConstruction = ({ altTitle }: UnderConstructionProps) => {
  return (
    <div className={styles.container}>
      <h3>
        {altTitle ??
          `This page is currently undergoing updates, please revisit at a later
        time for the latest information.`}
      </h3>
      {/* <LuConstruction className={styles.icon} /> */}
    </div>
  );
};

export default UnderConstruction;
