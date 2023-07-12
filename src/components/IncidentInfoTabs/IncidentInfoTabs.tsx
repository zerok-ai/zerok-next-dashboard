import { Skeleton, Tabs, Tab } from "@mui/material";
import { nanoid } from "nanoid";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import objectPath from "object-path";
import { useState, useEffect } from "react";
import sjson from "secure-json-parse";
import { useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import { GET_SPAN_RAWDATA_ENDPOINT } from "utils/endpoints";
import {
  SpanResponse,
  SpanRawDataResponse,
  SpanDetail,
  HttpRequestDetail,
  HttpResponseDetail,
  GenericObject,
} from "utils/types";
import cx from "classnames";
import styles from "./IncidentInfoTabs.module.scss";
import { HTTP_TAB_KEYS } from "./IncidentInfoTabs.http";
import {
  DEFAULT_TAB,
  TabSkeleton,
  getTabByProtocol,
} from "./IncidentInfoTabs.utils";

const IncidentTabs = ({
  selectedSpan,
  spanData,
}: {
  selectedSpan: null | string;
  spanData: null | SpanResponse;
}) => {
  const router = useRouter();
  const { issue_id, id: incidentId } = router.query;
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const { selectedCluster } = useSelector(clusterSelector);
  const endpoint = GET_SPAN_RAWDATA_ENDPOINT.replace(
    "{cluster_id}",
    selectedCluster as string
  )
    .replace("{span_id}", selectedSpan as string)
    .replace("{incident_id}", incidentId as string)
    .replace("{issue_id}", issue_id as string);

  const {
    loading,
    error,
    data: rawSpanResponse,
    fetchData: fetchRawData,
    setData: setRawSpanResponse,
  } = useFetch<SpanRawDataResponse>(`span_raw_data_details`);

  useEffect(() => {
    if (selectedSpan && selectedCluster && incidentId) {
      setRawSpanResponse(null);
      fetchRawData(endpoint);
    }
  }, [selectedSpan, incidentId, selectedCluster]);

  useEffect(() => {
    setActiveTab(DEFAULT_TAB);
  }, [router]);

  let rawSpanData = rawSpanResponse
    ? rawSpanResponse[selectedSpan as string]
    : null;

  if (!rawSpanData || !spanData || !selectedSpan) {
    return <TabSkeleton />;
  }

  if (rawSpanData.protocol === "http") {
    try {
      rawSpanData.response_payload = sjson.parse(
        rawSpanData.response_payload as string
      );
      rawSpanData.request_payload = JSON.parse(
        rawSpanData.request_payload as string
      );
    } catch (er) {
      console.log({ er });
    }
  }

  const { keys: TAB_KEYS, content: TAB_CONTENT } = getTabByProtocol(
    rawSpanData.protocol,
    spanData[selectedSpan],
    rawSpanData
  );
  return (
    <div className={styles["tabs-container"]}>
      {/*  */}
      <Tabs value={activeTab} onChange={(_, key) => setActiveTab(key)}>
        {TAB_KEYS.map((tab: GenericObject) => (
          <Tab key={tab.key} label={tab.label} value={tab.key} />
        ))}
      </Tabs>
      {/* tab content */}
      {selectedSpan && rawSpanData && (
        <div className={styles["tab-content-container"]}>
          {TAB_CONTENT.map((tab, index) => {
            if (tab.valueObj) {
              return (
                <div
                  className={cx(styles["tab-content"], styles["response-tab"])}
                  role="tabpanel"
                  hidden={activeTab !== TAB_KEYS[index].key}
                  key={nanoid()}
                >
                  {tab.list.map((obj) => {
                    const val = objectPath.get(
                      tab.valueObj as
                        | SpanDetail
                        | HttpRequestDetail
                        | HttpResponseDetail,
                      obj.key
                    ) as any;
                    return (
                      <div className={styles["tab-row"]} key={obj.key}>
                        <p className={styles["tab-row-label"]}>{obj.label}:</p>
                        <div className={styles["tab-row-value"]}>
                          {obj.render ? obj.render(val) : val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default IncidentTabs;
