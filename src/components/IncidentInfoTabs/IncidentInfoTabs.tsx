// @ts-nocheck

import { Tabs, Tab } from "@mui/material";
import { nanoid } from "nanoid";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import objectPath from "object-path";
import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { useSelector } from "redux/store";
import { clusterSelector } from "redux/cluster";
import {
  GET_SERVICE_PODS_ENDPOINT,
  GET_SPAN_RAWDATA_ENDPOINT,
} from "utils/endpoints";
import {
  SpanResponse,
  SpanRawDataResponse,
  SpanDetail,
  HttpRequestDetail,
  HttpResponseDetail,
  GenericObject,
  PodDetail,
} from "utils/types";
import cx from "classnames";
import styles from "./IncidentInfoTabs.module.scss";
import { HTTP_OVERVIEW_KEYS, HTTP_TAB_KEYS } from "./IncidentInfoTabs.http";
import {
  DEFAULT_TAB,
  DEFAULT_TAB_KEYS,
  TabSkeleton,
  getTabByProtocol,
} from "./IncidentInfoTabs.utils";
import { getFormattedServiceName, getNamespace } from "utils/functions";

const IncidentTabs = ({
  selectedSpan,
  spanData,
}: {
  selectedSpan: null | string;
  spanData: null | SpanResponse;
}) => {
  const router = useRouter();
  const { issue_id, id: incidentId } = router.query;
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB_KEYS[0].key);
  const { selectedCluster } = useSelector(clusterSelector);
  const type = "http";
  const spanEndpoint = (type === "http" ? "/errors.json" : `/mysql.json`)
    .replace("{cluster_id}", selectedCluster as string)
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

  const {
    loading: podLoading,
    error: podError,
    data: podData,
    fetchData: fetchPodData,
    setData: setPodData,
  } = useFetch<PodDetail[]>(`results`);

  useEffect(() => {
    if (selectedSpan && selectedCluster && incidentId) {
      setRawSpanResponse(null);
      fetchRawData(spanEndpoint);
    }
  }, [selectedSpan, incidentId, selectedCluster]);

  useEffect(() => {
    setActiveTab(DEFAULT_TAB_KEYS[0].key);
  }, [router]);

  useEffect(() => {
    if (selectedCluster && selectedSpan && spanData) {
      const currentSpan = spanData[selectedSpan];
      const service = currentSpan.source;
      const namespace = getNamespace(service);
      const serviceName = getFormattedServiceName(service).split("-")[0];
      const podEndpoint = GET_SERVICE_PODS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{namespace}", namespace)
        .replace("{service_name}", serviceName);
      fetchPodData(podEndpoint);
    }
  }, [selectedSpan, selectedCluster, spanData]);

  let accessor = type === "http" ? selectedSpan : "something";
  // let rawSpanData = rawSpanResponse
  //   ? (rawSpanResponse[accessor] as SpanResponse)
  //   : null;
  let rawSpanData = rawSpanResponse;
  const parsedSpanData = useMemo(() => {
    if (!rawSpanData) return null;
    const parsedSpanData = rawSpanData as SpanDetail;
    if (rawSpanData.protocol === "http") {
      try {
        parsedSpanData.request_payload = JSON.parse(
          rawSpanData.request_payload as string
        );
        parsedSpanData.response_payload = JSON.parse(
          rawSpanData.response_payload as string
        );
      } catch (err) {}
    }
    return parsedSpanData;
  }, [rawSpanData]);
  console.log({ parsedSpanData });
  const { keys: TAB_KEYS, content: TAB_CONTENT } = rawSpanData
    ? getTabByProtocol(
        parsedSpanData.protocol,
        spanData[selectedSpan],
        parsedSpanData,
        podData
      )
    : { keys: null, content: null };

  if (!rawSpanData || !spanData || !selectedSpan || !TAB_KEYS) {
    return <TabSkeleton />;
  }
  console.log({ TAB_KEYS });
  return (
    <div className={styles["tabs-container"]}>
      {/*  */}
      <Tabs
        value={activeTab}
        onChange={(_, key) => {
          setActiveTab(key);
        }}
      >
        {TAB_KEYS.map((tab: GenericObject) => (
          <Tab key={tab.key} label={tab.label} value={tab.key} />
        ))}
      </Tabs>
      {/* tab content */}
      {selectedSpan && parsedSpanData && (
        <div className={styles["tab-content-container"]}>
          {TAB_CONTENT.map((tab, index) => {
            if (tab.component) {
              return (
                <div
                  className={cx(styles["tab-content"], styles["response-tab"])}
                  role="tabpanel"
                  hidden={activeTab !== TAB_KEYS[index].key}
                  key={nanoid()}
                >
                  {tab.component}
                </div>
              );
            } else if (tab.valueObj) {
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

export default memo(IncidentTabs);
