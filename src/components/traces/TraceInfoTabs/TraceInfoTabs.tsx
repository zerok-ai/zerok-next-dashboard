import { Tab, Tabs } from "@mui/material";
import TabSkeletons from "components/helpers/TabSkeletons";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { GET_SPAN_RAWDATA_ENDPOINT } from "utils/endpoints";
import {
  // GenericObject,
  type SpanRawData,
  type SpanRawDataResponse,
  type SpanResponse,
} from "utils/types";

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
  const {
    data: rawResponse,
    fetchData: fetchRawData,
    error: rawDataError,
  } = useFetch<SpanRawDataResponse>("span_raw_data_details", null);
  const router = useRouter();
  const { issue_id } = router.query;
  const { selectedCluster } = useSelector(clusterSelector);
  const [activeTab, setActiveTab] = useState(DEFAULT_TABS[0].value);
  const span = allSpans[selectedSpan];
  const hasRawData = span.has_raw_data;
  useEffect(() => {
    if (selectedCluster && selectedSpan && incidentId && hasRawData) {
      const endpoint = GET_SPAN_RAWDATA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issue_id as string)
        .replace("{incident_id}", incidentId)
        .replace("{span_id}", selectedSpan);
      fetchRawData(endpoint);
    }
  }, [selectedSpan, incidentId]);
  const rawData = rawResponse ? rawResponse[selectedSpan] : null;
  if (hasRawData && !rawResponse && !rawDataError) {
    return <TabSkeletons />;
  }

  const tabs = getTabs(allSpans[selectedSpan]);
  const renderTab = () => {
    if (rawDataError) {
      return (
        <div>
          Could not fetch spans, please try again later or contact support.
        </div>
      );
    }
    const tab = tabs.find((t) => t.value === activeTab);
    if (tab && tab.render) {
      const span = allSpans[selectedSpan];
      if (rawData) {
        return tab.render(span, rawData);
      }

      if (
        (!rawData && tab.value === DEFAULT_TABS[0].value) ||
        (tab.value === SPAN_ATTRIBUTE_TABS[0].value && span.all_attributes)
      ) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return tab.render(span, {} as SpanRawData);
      }
      return <p>No data.</p>;
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
