import { Button, Divider, Tab, Tabs } from "@mui/material";
import RegexRuleForm from "components/forms/RegexRuleForm";
import CodeBlock from "components/helpers/CodeBlock";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import DrawerX from "components/themeX/DrawerX";
import ModalX from "components/themeX/ModalX";
import TableX from "components/themeX/TableX";
import { useToggle } from "hooks/useToggle";
import { nanoid } from "nanoid";
import Head from "next/head";
import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import {
  DATA_OBFUSCATION_TABS,
  REGEX_DRAWER_WIDTH,
} from "utils/data/constants";
import { DEFAULT_RULES } from "utils/data/piiRules";
import {
  type DefaultRegexRuleType,
  type ObfuscationRuleType,
} from "utils/data/types";

import styles from "./DataObfuscationPage.module.scss";
import {
  data,
  // data,
  getObfuscationColumns,
  getRuleColumns,
} from "./DataObfuscationPage.utils";

const DataObfuscationPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>(
    DATA_OBFUSCATION_TABS[0].value
  );
  const [regexDrawerOpen, toggleRegexDrawer] = useToggle(false);
  const [selectedDefaultRule, setSelectedDefaultRule] =
    useState<DefaultRegexRuleType | null>(null);
  // const [whitelistDrawerOpen, toggleWhitelistDrawer] = useToggle(false);
  const changeTab = (e: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const editRule = (row: ObfuscationRuleType) => {
    console.log({ row });
  };
  const onRuleClick = (row: DefaultRegexRuleType) => {
    setSelectedDefaultRule(row);
  };
  const resetDefaultRule = () => {
    setSelectedDefaultRule(null);
  };
  const ruleColumns = getRuleColumns({ onRuleClick });
  const columns = getObfuscationColumns({
    onEdit: editRule,
    onUpdate: editRule,
  });
  const renderTabContent = () => {
    switch (selectedTab) {
      case "custom":
        return (
          <TableX columns={columns} data={data} noDataMessage="No data." />
        );
      case "default":
        return <TableX columns={ruleColumns} data={DEFAULT_RULES} />;
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Data Obfuscation"
        showRange={false}
        showRefresh={false}
      />
      <h6 className={styles.text}>
        Any sensitive data can be obfuscated before being sent to ZeroK.
        Sensitive information might include personally-identifiable information
        such as names, addresses, financial data or other data you may be
        required by regulation to protect when shared. <br /> <br /> You can
        define regular expressions matching your sensitive information by
        creating rules, and ZeroK will obfuscate any data matching those rules
        before storing or processing it.
      </h6>
      <div className={styles.buttons}>
        <Button variant="contained" color="secondary">
          Whitelist
        </Button>
        <Button variant="contained" onClick={toggleRegexDrawer}>
          <HiOutlinePlus className={styles["btn-icon"]} /> Create a new rule
        </Button>
      </div>
      {/* Tab list */}
      <Tabs value={selectedTab} className={styles.tabs} onChange={changeTab}>
        {DATA_OBFUSCATION_TABS.map((tab) => {
          return <Tab label={tab.label} key={tab.value} value={tab.value} />;
        })}
      </Tabs>
      {/* Tab content */}
      <div className={styles["tab-content"]} role="tabpanel">
        {renderTabContent()}
      </div>

      {/* Regex form */}

      <DrawerX
        onClose={toggleRegexDrawer}
        title="Create a new rule"
        width={REGEX_DRAWER_WIDTH}
        open={regexDrawerOpen}
      >
        <div className={styles["regex-form-container"]}>
          <RegexRuleForm
            onFinish={toggleRegexDrawer}
            onClose={toggleRegexDrawer}
          />
        </div>
      </DrawerX>

      {/* Rule display */}
      {selectedDefaultRule && (
        <ModalX
          isOpen={!!selectedDefaultRule}
          onClose={resetDefaultRule}
          title={selectedDefaultRule.name ?? "Default rule"}
        >
          <div className={styles["rule-container"]}>
            {selectedDefaultRule.patterns.map((p) => {
              return (
                <div className={styles["rule-item-container"]} key={nanoid()}>
                  <div className={styles["rule-item"]}>
                    <p>Name:</p>
                    <p>{p.name}</p>
                  </div>
                  <div className={styles["rule-item"]}>
                    <p>Pattern:</p>
                    <CodeBlock code={p.regex} allowCopy={true} color="dark" />
                  </div>
                  <Divider />
                </div>
              );
            })}
          </div>
        </ModalX>
      )}
    </div>
  );
};

DataObfuscationPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <PrivateRoute>
      <Head>
        <title>ZeroK Dashboard | Data Obfuscation</title>
      </Head>
      <PageLayout>{page}</PageLayout>
    </PrivateRoute>
  );
};

export default DataObfuscationPage;
