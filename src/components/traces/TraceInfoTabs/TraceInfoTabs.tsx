import { Tab, Tabs } from "@mui/material";
import TabSkeletons from "components/helpers/TabSkeletons";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { GET_SPAN_RAWDATA_ENDPOINT } from "utils/endpoints";
import { type SpanRawDataResponse, type SpanResponse } from "utils/types";

import styles from "./TraceInfoTabs.module.scss";
import { DEFAULT_TABS, getTabs } from "./TraceInfoTabs.utils";

interface TraceInfoTabsProps {
  selectedSpan: string;
  allSpans: SpanResponse;
}

const TraceInfoTabs = ({ selectedSpan, allSpans }: TraceInfoTabsProps) => {
  const { data: rawResponse, fetchData: fetchRawData } =
    useFetch<SpanRawDataResponse>("span_raw_data_details", null);
  const router = useRouter();
  const { issue, trace } = router.query;
  const { selectedCluster } = useSelector(clusterSelector);
  const [activeTab, setActiveTab] = useState(DEFAULT_TABS[0].value);
  useEffect(() => {
    if (selectedCluster && selectedSpan) {
      const endpoint = GET_SPAN_RAWDATA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issue as string)
        .replace("{incident_id}", trace as string)
        .replace("{span_id}", selectedSpan);
      fetchRawData(endpoint);
    }
  }, [selectedSpan]);
  const rawData = rawResponse ? rawResponse[selectedSpan] : null;
  if (!rawResponse || !rawData) {
    return <TabSkeletons />;
  }

  const tabs = getTabs(rawData.protocol);

  const renderTab = () => {
    const tab = tabs.find((t) => t.value === activeTab);
    if (tab && tab.render) {
      return tab.render(allSpans[selectedSpan], rawData);
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <Tabs
        value={activeTab}
        onChange={(e, value) => {
          setActiveTab(value);
        }}
      >
        {tabs.map((t) => {
          return <Tab label={t.label} value={t.value} key={nanoid()} />;
        })}
      </Tabs>

      <div className={styles["tab-content"]}>{renderTab()}</div>
    </div>
  );
};

export default TraceInfoTabs;
