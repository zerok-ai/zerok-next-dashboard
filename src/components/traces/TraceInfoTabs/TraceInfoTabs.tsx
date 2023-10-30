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
import {
  DEFAULT_TABS,
  getTabs,
  SPAN_ATTRIBUTE_TABS,
} from "./TraceInfoTabs.utils";

interface TraceInfoTabsProps {
  selectedSpan: string;
  allSpans: SpanResponse;
  incidentId: string | null;
}

const TraceInfoTabs = ({
  selectedSpan,
  allSpans,
  incidentId,
}: TraceInfoTabsProps) => {
  const { data: rawResponse, fetchData: fetchRawData } =
    useFetch<SpanRawDataResponse>("span_raw_data_details", null);
  const router = useRouter();
  const { issue } = router.query;
  const { selectedCluster } = useSelector(clusterSelector);
  const [activeTab, setActiveTab] = useState(DEFAULT_TABS[0].value);
  useEffect(() => {
    if (selectedCluster && selectedSpan && incidentId) {
      const endpoint = GET_SPAN_RAWDATA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issue as string)
        .replace("{incident_id}", incidentId)
        .replace("{span_id}", selectedSpan);
      fetchRawData(endpoint);
    }
  }, [selectedSpan, incidentId]);
  // useEffect(() => {
  //   if(selectedSpan){
  //     fetchSpanTags
  //   }
  // },[selectedSpan])
  const rawData = rawResponse ? rawResponse[selectedSpan] : null;
  if (!rawResponse || !rawData) {
    return <TabSkeletons />;
  }

  let tabs = getTabs(rawData.protocol);

  const renderTab = () => {
    const tab = tabs.find((t) => t.value === activeTab);
    if (tab && tab.render) {
      const span = allSpans[selectedSpan];
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return tab.render(span, rawData);
    }
    return null;
  };

  const span = allSpans[selectedSpan];
  if (span.all_attributes) {
    tabs = [...tabs, ...SPAN_ATTRIBUTE_TABS];
  }
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
