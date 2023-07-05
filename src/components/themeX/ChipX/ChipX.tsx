import styles from "./ChipX.module.scss";

interface ChipXProps {
  label: string;
}

const ChipX = ({ label }: ChipXProps) => {
  return <div className={styles["container"]}>{label}</div>;
};

export default ChipX;
