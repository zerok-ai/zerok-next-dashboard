import { Button, Divider, Tab, Tabs } from "@mui/material";
import RegexRuleForm from "components/forms/RegexRuleForm";
import CodeBlock from "components/helpers/CodeBlock";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import DrawerX from "components/themeX/DrawerX";
import ModalX from "components/themeX/ModalX";
import PaginationX from "components/themeX/PaginationX";
import TableX from "components/themeX/TableX";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import {
  DATA_OBFUSCATION_TABLE_PAGE_SIZE,
  DATA_OBFUSCATION_TABS,
  REGEX_DRAWER_WIDTH,
} from "utils/data/constants";
import {
  LIST_OBFUSCATION_RULE_ENDPOINT,
  UPDATE_OBFUSCATION_RULE_ENDPOINT,
} from "utils/data/endpoint";
import { DEFAULT_RULES } from "utils/data/piiRules";
import {
  type DefaultRegexRuleType,
  type ObfuscationRuleType,
} from "utils/data/types";
import { dispatchSnackbar } from "utils/generic/functions";
import raxios from "utils/raxios";

import styles from "./DataObfuscationPage.module.scss";
import {
  getObfuscationColumns,
  getRuleColumns,
} from "./DataObfuscationPage.utils";

const DataObfuscationPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>(
    DATA_OBFUSCATION_TABS[0].value
  );
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [selectedRule, setSelectedRule] = useState<ObfuscationRuleType | null>(
    null
  );
  const [selectedDefaultRule, setSelectedDefaultRule] =
    useState<DefaultRegexRuleType | null>(null);
  const router = useRouter();

  const {
    data: rules,
    fetchData: fetchRules,
    setData: setRules,
    error: rulesError,
  } = useFetch<ObfuscationRuleType[]>("obfuscations");

  const getRules = async () => {
    setRules(null);
    const page = parseInt(router.query.page as string) || 1;
    const offset = (page - 1) * DATA_OBFUSCATION_TABLE_PAGE_SIZE;
    const endpoint =
      LIST_OBFUSCATION_RULE_ENDPOINT +
      `?offset=${offset}&limit=${DATA_OBFUSCATION_TABLE_PAGE_SIZE}`;
    fetchRules(endpoint);
  };

  useEffect(() => {
    if (router.isReady) {
      setRules(null);
      getRules();
    }
  }, [router]);

  const changeTab = (e: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const editRule = (row: ObfuscationRuleType) => {
    setSelectedRule(row);
    setDrawerMode("edit");
  };
  const updateRuleStatus = async (row: ObfuscationRuleType) => {
    const { id, enabled, name, analyzer, anonymizer } = row;
    setSelectedRule(row);
    try {
      const endpoint = UPDATE_OBFUSCATION_RULE_ENDPOINT.replace(
        "{obfuscation_id}",
        id
      );
      const body = {
        name,
        analyzer,
        anonymizer,
        enabled: !enabled,
      };
      await raxios.put(endpoint, body);
      dispatchSnackbar(
        "success",
        `Rule ${name} ${enabled ? "disabled" : "enabled"}`
      );
      getRules();
    } catch (err) {
      dispatchSnackbar("error", "Could not update rule, please try again");
    } finally {
      setSelectedRule(null);
    }
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
    onUpdate: updateRuleStatus,
    selectedRule,
  });
  const renderTabContent = () => {
    switch (selectedTab) {
      case "custom": {
        if (rulesError) {
          return (
            <p>Could not fetch rules, please try again or contact support.</p>
          );
        } else {
          return (
            <TableX columns={columns} data={rules} noDataMessage="No data." />
          );
        }
      }
      case "default":
        return <TableX columns={ruleColumns} data={DEFAULT_RULES} />;
    }
  };

  const toggleCreateDrawer = () => {
    if (drawerMode === "create") {
      setDrawerMode(null);
    } else setDrawerMode("create");
  };

  const closeDrawer = () => {
    fetchRules(LIST_OBFUSCATION_RULE_ENDPOINT);
    setDrawerMode(null);
    setSelectedRule(null);
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
        <Button variant="contained" onClick={toggleCreateDrawer}>
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

      <div className={styles["pagination-container"]}>
        <PaginationX
          totalItems={DATA_OBFUSCATION_TABLE_PAGE_SIZE * 3}
          itemsPerPage={DATA_OBFUSCATION_TABLE_PAGE_SIZE}
        />
      </div>

      {/* Regex form */}

      <DrawerX
        onClose={closeDrawer}
        title={drawerMode === "edit" ? "Edit rule" : "Create a new rule"}
        width={REGEX_DRAWER_WIDTH}
        open={!!drawerMode}
      >
        <div className={styles["regex-form-container"]}>
          <RegexRuleForm
            onFinish={closeDrawer}
            onClose={closeDrawer}
            editMode={drawerMode === "edit"}
            selectedRule={selectedRule}
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
