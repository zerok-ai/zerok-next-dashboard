import { Button, Checkbox, MenuItem } from "@mui/material";
import SearchBar from "components/SearchBar";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { type FormEvent, useEffect, useState } from "react";
import { getFormattedServiceName, getNamespace } from "utils/functions";
import { type ServiceMapDetail } from "utils/health/types";
import { type GenericObject } from "utils/types";

import styles from "./HealthMapFilterForm.module.scss";

interface HealthMapFilterFormProps {
  serviceList: ServiceMapDetail[];
  onFinish: () => void;
}

interface FilterType {
  serviceNames: string[];
  namespaces: string[];
}

const HealthMapFilterForm = ({
  serviceList,
  onFinish,
}: HealthMapFilterFormProps) => {
  const serviceNameMap = new Set<string>();
  const namespaceMap = new Set<string>();
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

  const [searchValue, setSearchValue] = useState("");
  const serviceNames = Array.from(serviceNameMap).filter((sn) =>
    sn.includes(searchValue)
  );
  const namespaces = Array.from(namespaceMap).filter((ns) =>
    ns.includes(searchValue)
  );

  const [filters, setFilters] = useState<FilterType>({
    namespaces: [],
    serviceNames: [],
  });

  const router = useRouter();

  useEffect(() => {
    const { namespaces, serviceNames } = router.query;
    if (namespaces) {
      setFilters((prev) => ({
        ...prev,
        namespaces: (namespaces as string).split(","),
      }));
    }
    if (serviceNames) {
      setFilters((prev) => ({
        ...prev,
        serviceNames: (serviceNames as string).split(","),
      }));
    }
  }, [router.query]);

  const handleClick = (key: "namespaces" | "serviceNames", value: string) => {
    const checked = !filters[key].includes(value);
    if (checked) {
      setFilters((prev) => ({
        ...prev,
        [key]: [...prev[key], value],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: prev[key].filter((v) => v !== value),
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { namespaces, serviceNames } = filters;
    const query: GenericObject = {};
    if (namespaces.length) {
      query.namespaces = namespaces.join(",");
    }
    if (serviceNames.length) {
      query.serviceNames = serviceNames.join(",");
    }
    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...query },
    });
    onFinish();
  };

  const clearFilters = () => {
    setFilters({
      namespaces: [],
      serviceNames: [],
    });
    router.push({
      pathname: router.pathname,
      query: {},
    });
    onFinish();
  };

  // @TODO - better type checking for filter groups

  const FILTER_GROUPS: Array<{
    list: string[];
    title: string;
    key: "namespaces" | "serviceNames";
  }> = [
    {
      list: namespaces,
      title: "Namespace",
      key: "namespaces",
    },
    {
      list: serviceNames,
      title: "Service Name",
      key: "serviceNames",
    },
  ];

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div className={styles["form-items"]}>
        <div className={styles["form-search-container"]}>
          <SearchBar
            onChange={(s) => {
              setSearchValue(s);
            }}
            inputState={searchValue}
          />
        </div>
        {FILTER_GROUPS.map((fg) => {
          return (
            <div className={styles["form-group"]} key={nanoid()}>
              <p className={styles["form-group-title"]}>{fg.title}</p>
              <div className={styles["form-group-items"]}>
                {fg.list.length ? (
                  fg.list.map((nm) => {
                    return (
                      <MenuItem
                        className={styles["form-group-item"]}
                        key={nm}
                        role="menuitem"
                        onClick={() => {
                          handleClick(fg.key, nm);
                        }}
                      >
                        <Checkbox checked={filters[fg.key].includes(nm)} />
                        <label>{nm}</label>
                      </MenuItem>
                    );
                  })
                ) : (
                  <p className={styles["empty-text"]}>
                    No {fg.key} found for this search.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles["form-actions"]}>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Apply filters (
          {filters.namespaces.length + filters.serviceNames.length})
        </Button>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          fullWidth
          onClick={clearFilters}
        >
          Clear all
        </Button>
      </div>
    </form>
  );
};

export default HealthMapFilterForm;
