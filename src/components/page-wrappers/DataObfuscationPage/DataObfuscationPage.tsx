import { Button, Tab, Tabs } from "@mui/material";
import PageHeader from "components/helpers/PageHeader";
import PrivateRoute from "components/helpers/PrivateRoute";
import PageLayout from "components/layouts/PageLayout";
import TableX from "components/themeX/TableX";
import Head from "next/head";
import { Fragment, useState } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { HiOutlinePlus } from "react-icons/hi2";
import { DATA_OBFUSCATION_TABS } from "utils/data/constants";
import { type ObfuscationRuleType } from "utils/data/types";
import { type TableActionListType } from "utils/generic/types";

import styles from "./DataObfuscationPage.module.scss";
import { getObfuscationColumns } from "./DataObfuscationPage.utils";

const DataObfuscationPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>(
    DATA_OBFUSCATION_TABS[0].value
  );
  const changeTab = (e: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const columnActions: Array<TableActionListType<ObfuscationRuleType>> = [
    {
      label: (
        <Fragment>
          <HiOutlinePencil /> Edit rule
        </Fragment>
      ),
      onClick: (data) => {
        // console.log({ data });
      },
    },
    {
      label: (
        <Fragment>
          <HiOutlineTrash /> Delete rule
        </Fragment>
      ),
      onClick: (data) => {
        // console.log({ data });
      },
    },
  ];
  const columns = getObfuscationColumns({ actions: columnActions });
  // const data: ObfuscationRuleType[] = [
  //   {
  //     name: "test",
  //     analyzer: {
  //       pattern: "test",
  //       type: "regex",
  //     },
  //     enabled: true,
  //     created_by: "test",
  //     updated_at: "test",
  //     created_at: "test",
  //     anonymizer: {
  //       operator: "replace",
  //       params: {
  //         new_value: "test",
  //       },
  //     },
  //   },
  //   {
  //     name: "test 2",
  //     analyzer: {
  //       pattern: "test",
  //       type: "regex",
  //     },
  //     enabled: true,
  //     created_by: "test 2",
  //     updated_at: "test",
  //     created_at: "test",
  //     anonymizer: {
  //       operator: "replace",
  //       params: {
  //         new_value: "test 2",
  //       },
  //     },
  //   },
  // ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "rules":
        return <TableX columns={columns} data={[]} />;
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
        <Button variant="contained">
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
