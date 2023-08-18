import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { trimString } from "utils/functions";

import styles from "./BackLink.module.scss";

interface BackLinkProps {
  onBack: () => void;
  title: string | React.ReactNode;
}

const BackLink = ({ onBack, title }: BackLinkProps) => {
  return (
    <div className={styles.container} role="button" onClick={onBack}>
      <HiOutlineArrowSmLeft className={styles.icon} />
      {trimString(title as string, 40)}
    </div>
  );
};

export default BackLink;
