import { Breadcrumbs } from "@mui/material";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiArrowLongRight } from "react-icons/hi2";
import { BREADCRUMB_ROUTES } from "utils/breadcrumbs";

import styles from "./BreadcrumbX.module.scss";

const BreadcrumbX = () => {
  const router = useRouter();
  const { pathname } = router;
  const isNestedRouter = pathname.split("/").length > 1;
  if (!isNestedRouter) return null;
  const breadcrumbs = BREADCRUMB_ROUTES[pathname];
  if (!breadcrumbs) return null;
  return (
    <div className={styles.container}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<HiArrowLongRight className={styles.seperator} />}
      >
        {breadcrumbs.crumbs.map((breadcrumb, idx) => {
          if (idx === breadcrumbs.crumbs.length - 1) {
            return (
              <span key={nanoid()} className={styles.active}>
                {breadcrumb.name}
              </span>
            );
          }
          return (
            <Link href={breadcrumb.path} key={nanoid()}>
              <a className={styles.link}>{breadcrumb.name}</a>
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbX;
