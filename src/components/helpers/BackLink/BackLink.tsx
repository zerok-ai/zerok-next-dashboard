import { HiOutlineArrowSmLeft } from "react-icons/hi";

import styles from "./BackLink.module.scss";

interface BackLinkProps {
  onBack: () => void;
  title: string | React.ReactNode;
}

const BackLink = ({ onBack, title }: BackLinkProps) => {
  return (
    <div className={styles.container} role="button" onClick={onBack}>
      <HiOutlineArrowSmLeft className={styles.icon} />
      {title}
    </div>
  );
};

export default BackLink;
