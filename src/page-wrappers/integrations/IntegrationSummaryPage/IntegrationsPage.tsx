import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Tab,
  Tabs,
} from "@mui/material";
import cx from "classnames";
import PageHeader from "components/helpers/PageHeader";
import IntegrationCard from "components/integrations/IntegrationCard";
import ZkPrivateRoute from "components/ZkPrivateRoute";
import { Fragment, useMemo, useState } from "react";
import {
  INTEGRATION_CATEGORIES,
  INTEGRATION_LIST,
} from "utils/integrations/constants";
import { type IntegrationCategoriesType } from "utils/integrations/types";

import styles from "./IntegrationsPage.module.scss";

const IntegrationsPage = () => {
  const [selectedTab, setSelectedTab] = useState<IntegrationCategoriesType>(
    INTEGRATION_CATEGORIES[0]
  );
  const atRestList = useMemo(() => {
    return INTEGRATION_LIST.filter((integration) => {
      return integration.dataSubcategory === "at-rest";
    });
  }, []);
  const inFlightList = useMemo(() => {
    return INTEGRATION_LIST.filter((integration) => {
      return integration.dataSubcategory === "in-flight";
    });
  }, []);
  const accordions = useMemo(() => {
    return [
      {
        title: "In-flight data",
        list: inFlightList,
      },
      {
        title: "At rest data",
        list: atRestList,
      },
    ];
  }, []);
  const renderTabContent = () => {
    if (selectedTab === "Communication") {
      const list = INTEGRATION_LIST.filter((integration) =>
        integration.tags.includes("Communication")
      );
      return list.map((integration) => {
        return (
          <IntegrationCard
            key={integration.name}
            integration={integration}
            border={true}
          />
        );
      });
    } else {
      return accordions.map((accordion, idx) => {
        return (
          <Accordion key={accordion.title} defaultExpanded>
            <AccordionSummary>
              <h6 className={styles["accordion-title"]}>{accordion.title}</h6>
            </AccordionSummary>
            <AccordionDetails>
              {accordion.list.map((integration, idx) => {
                return (
                  <Fragment key={integration.name}>
                    <IntegrationCard integration={integration} border={false} />
                    {idx < accordion.list.length - 1 && <Divider />}
                  </Fragment>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      });
    }
  };
  return (
    <div className={styles.container}>
      <PageHeader
        title="Integrations"
        htmlTitle="Integrations"
        showRange={false}
        showRefresh={false}
        showBreadcrumb={false}
      />
      <div className={styles.header}>
        <Tabs
          value={selectedTab}
          className={styles.tabs}
          onChange={(e, value) => {
            setSelectedTab(value);
          }}
          variant="standard"
          scrollButtons="auto"
        >
          {INTEGRATION_CATEGORIES.map((category) => {
            return (
              <Tab
                key={category}
                label={category}
                value={category}
                className={cx(
                  styles.tab,
                  selectedTab === category && styles.selected
                )}
              />
            );
          })}
        </Tabs>
        <div className={styles["tab-content"]}>{renderTabContent()}</div>
      </div>
    </div>
  );
};

IntegrationsPage.getLayout = function getLayout(page: React.ReactNode) {
  return <ZkPrivateRoute>{page}</ZkPrivateRoute>;
};

export default IntegrationsPage;
