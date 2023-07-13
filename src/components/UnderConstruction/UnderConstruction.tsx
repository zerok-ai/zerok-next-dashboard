import { LuConstruction } from "react-icons/lu";
import styles from "./UnderConstruction.module.scss";

const UnderConstruction = () => {
  return (
    <div className={styles["container"]}>
      <h3>Under construction, check back in later.</h3>
      <LuConstruction className={styles["icon"]} />
    </div>
  );
};

export default UnderConstruction;
