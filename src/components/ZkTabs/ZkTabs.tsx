import { Tab, Tabs } from "@mui/material";

import styles from "./ZkTabs.module.scss";

interface ZkTabsProps {
  tabs: Array<{
    label: string;
    value: string;
  }>;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const ZkTabs = ({ tabs, selectedTab, setSelectedTab }: ZkTabsProps) => {
  return (
    <Tabs
      className={styles.tabs}
      value={selectedTab}
      onChange={(e, val) => {
        setSelectedTab(val);
      }}
    >
      {tabs.map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </Tabs>
  );
};

export default ZkTabs;
