import { ServiceMapDetail } from "utils/health/types";
import styles from "./HealthMapFilterForm.module.scss";
import { getFormattedServiceName, getNamespace } from "utils/functions";
import { Button, Checkbox } from "@mui/material";

interface HealthMapFilterForm {
  serviceList: ServiceMapDetail[];
}

const HealthMapFilterForm = ({ serviceList }: HealthMapFilterForm) => {
  let serviceNameMap: Set<string> = new Set();
  let namespaceMap: Set<string> = new Set();
  serviceList.forEach((service) => {
    if (
      service.requestor_service &&
      !serviceNameMap.has(service.requestor_service)
    ) {
      serviceNameMap.add(getFormattedServiceName(service.requestor_service));
      const namespace = getNamespace(service.requestor_service);
      if (!namespaceMap.has(namespace)) {
        namespaceMap.add(namespace);
      }
    }
    if (
      service.responder_service &&
      !serviceNameMap.has(service.responder_service)
    ) {
      serviceNameMap.add(getFormattedServiceName(service.responder_service));
      const namespace = getNamespace(service.responder_service);
      if (!namespaceMap.has(namespace)) {
        namespaceMap.add(namespace);
      }
    }
  });
  const serviceNames = Array.from(serviceNameMap);
  const namespaces = Array.from(namespaceMap);

  return (
    <form className={styles["form"]}>
      <div className={styles["form-items"]}>
        {/* Namespaces */}
        <div className={styles["form-group"]}>
          <p className={styles["form-group-title"]}>Namespace</p>
          <div className={styles["form-group-items"]}>
            {namespaces.map((nm) => {
              return (
                <div className={styles["form-group-item"]} key={nm}>
                  <Checkbox />
                  <label>{nm}</label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service names */}
        <div className={styles["form-group"]}>
          <p className={styles["form-group-title"]}>Service Name</p>
          <div className={styles["form-group-items"]}>
            {serviceNames.map((sn) => {
              return (
                <div className={styles["form-group-item"]} key={sn}>
                  <Checkbox />
                  <label>{sn}</label>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles["form-actions"]}>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Apply filters
        </Button>
        <Button variant="contained" color="secondary" type="submit" fullWidth>
          Clear all
        </Button>
      </div>
    </form>
  );
};

export default HealthMapFilterForm;
