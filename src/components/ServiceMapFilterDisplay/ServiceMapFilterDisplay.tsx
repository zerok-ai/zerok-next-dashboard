import TagX from "components/themeX/TagX";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";

import styles from "./ServiceMapFilterDisplay.module.scss";

const ServiceMapFilterDisplay = () => {
  const router = useRouter();
  const { namespaces, serviceNames } = router.query;

  const nameSpaceFilters = namespaces
    ? Array.isArray(namespaces)
      ? namespaces
      : namespaces.split(",")
    : [];

  const serviceNameFilters = serviceNames
    ? Array.isArray(serviceNames)
      ? serviceNames
      : serviceNames.split(",")
    : [];

  const filterRemoval = (val: string) => {
    if (nameSpaceFilters.includes(val)) {
      const newFilters = nameSpaceFilters.filter((fil) => fil !== val);
      router.push({
        pathname: router.pathname,
        query: { ...router.query, namespaces: newFilters },
      });
    }
    if (serviceNameFilters.includes(val)) {
      const newFilters = serviceNameFilters.filter((fil) => fil !== val);
      router.push({
        pathname: router.pathname,
        query: { ...router.query, serviceNames: newFilters },
      });
    }
  };
  return nameSpaceFilters.length > 0 || serviceNameFilters.length > 0 ? (
    <div className={styles.container}>
      {[...nameSpaceFilters, ...serviceNameFilters].map((fil) => {
        return (
          <TagX label={fil} closable onClose={filterRemoval} key={nanoid()} />
        );
      })}
    </div>
  ) : null;
};

export default ServiceMapFilterDisplay;
