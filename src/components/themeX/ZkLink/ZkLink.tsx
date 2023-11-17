import cx from "classnames";
import Link from "next/link";

import styles from "./ZkLink.module.scss";

interface ZkLinkProps {
  href: string;
  children: React.ReactNode;
  highlight?: boolean;
}

const ZkLink = ({ href, children, highlight = false }: ZkLinkProps) => {
  return (
    <span className={cx(styles.link, highlight && styles.highlight)}>
      <Link href={href}>{children}</Link>
    </span>
  );
};

export default ZkLink;
