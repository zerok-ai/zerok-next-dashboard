import { useRouter } from "next/router";
import styles from "./ServiceMapFilterDisplay.module.scss";
import TagX from "components/themeX/TagX";

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
  return (
    <div className={styles["container"]}>
      {[...nameSpaceFilters, ...serviceNameFilters].map((fil) => {
        return <TagX label={fil} closable onClose={filterRemoval} />;
      })}
    </div>
  );
};

export default ServiceMapFilterDisplay;
