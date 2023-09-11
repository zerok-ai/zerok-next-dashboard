import { Tab, Tabs } from "@mui/material";
import cx from "classnames";
import PageHeader from "components/helpers/PageHeader";
import IntegrationCard from "components/integrations/IntegrationCard";
import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/maps/PrivateRoute";
import { useState } from "react";
import {
  INTEGRATION_CATEGORIES,
  INTEGRATION_LIST,
} from "utils/integrations/constants";

import styles from "./IntegrationsPage.module.scss";

const IntegrationsPage = () => {
  const [selectedTab, setSelectedTab] = useState(INTEGRATION_CATEGORIES[0]);
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
        <div className={styles["tab-content"]}>
          {INTEGRATION_LIST.filter((integration) =>
            integration.tags.includes(selectedTab)
          ).map((integration) => {
            return (
              <IntegrationCard
                key={integration.name}
                integration={integration}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

IntegrationsPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default IntegrationsPage;
