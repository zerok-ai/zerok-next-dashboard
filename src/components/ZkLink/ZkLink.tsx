import Link from "next/link";

import styles from "./ZkLink.module.scss";

interface ZkLinkProps {
  href: string;
  children: React.ReactNode;
  highlight?: boolean;
}

const ZkLink = ({ href, children, highlight = false }: ZkLinkProps) => {
  return (
    <Link href={href} className={styles.link}>
      {children}
    </Link>
  );
};

export default ZkLink;
