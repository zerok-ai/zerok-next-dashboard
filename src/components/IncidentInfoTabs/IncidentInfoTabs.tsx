import { Tab, Tabs } from "@mui/material";
import cx from "classnames";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import objectPath from "object-path";
import { useEffect, useMemo, useState } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import {
  GET_SERVICE_PODS_ENDPOINT,
  GET_SPAN_RAWDATA_ENDPOINT,
} from "utils/endpoints";
import { getFormattedServiceName, getNamespace } from "utils/functions";
import {
  type GenericObject,
  type HttpRequestDetail,
  type HttpResponseDetail,
  type PodDetail,
  type SpanDetail,
  type SpanRawDataResponse,
  type SpanResponse,
} from "utils/types";

import styles from "./IncidentInfoTabs.module.scss";
import {
  DEFAULT_TAB_KEYS,
  getTabByProtocol,
  TabSkeleton,
} from "./IncidentInfoTabs.utils";

const parseSpanData = (spans: SpanRawDataResponse) => {
  const newSpans: SpanRawDataResponse = {};

  Object.keys(spans).map((key) => {
    try {
      const span = spans[key];
      span.request_payload = JSON.parse(span.request_payload as string);
      span.response_payload = JSON.parse(span.response_payload as string);
      newSpans[key] = span;
    } catch (err) {
      // console.log({ err });
    }
    return true;
  });
  return newSpans;
};
const IncidentTabs = ({
  selectedSpan,
  spanData,
}: {
  selectedSpan: null | string;
  spanData: null | SpanResponse;
}) => {
  const router = useRouter();
  const { issue: issue_id, incident: incidentId } = router.query;
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB_KEYS[0].key);
  const { selectedCluster } = useSelector(clusterSelector);
  const spanEndpoint = GET_SPAN_RAWDATA_ENDPOINT.replace(
    "{cluster_id}",
    selectedCluster as string
  )
    .replace("{incident_id}", incidentId as string)
    .replace("{issue_id}", issue_id as string);

  const {
    data: rawSpanResponse,
    fetchData: fetchRawData,
    setData: setRawSpanResponse,
  } = useFetch<SpanRawDataResponse>(
    `span_raw_data_details`,
    null,
    parseSpanData
  );

  const { data: podData, fetchData: fetchPodData } = useFetch<PodDetail[]>(
    `results`,
    null
  );

  const {
    data: exceptionData,
    fetchData: fetchExceptionData,
    setData: setExceptionData,
  } = useFetch<SpanRawDataResponse>(
    `span_raw_data_details`,
    null,
    parseSpanData
  );

  useEffect(() => {
    if (selectedSpan && selectedCluster && incidentId) {
      setRawSpanResponse(null);
      setExceptionData(null);
      fetchRawData(spanEndpoint.replace("{span_id}", selectedSpan));
    }
  }, [selectedSpan, incidentId, selectedCluster]);

  useEffect(() => {
    setActiveTab(DEFAULT_TAB_KEYS[0].key);
    if (selectedSpan && spanData) {
      const span = spanData[selectedSpan];
      if (span.exceptionParent) {
        // find exception span
        const exceptionSpan: string | undefined = Object.keys(spanData).find(
          (key) => {
            const span = spanData[key];
            return span.protocol === "exception";
          }
        );
        if (exceptionSpan) {
          fetchExceptionData(spanEndpoint.replace("{span_id}", exceptionSpan));
        }
      }
    }
  }, [router, selectedSpan]);

  useEffect(() => {
    const currentSpan =
      spanData && selectedSpan ? spanData[selectedSpan] : null;
    if (selectedCluster && currentSpan) {
      const service = currentSpan.source;
      const namespace = getNamespace(service);
      const serviceName = getFormattedServiceName(service);
      const podEndpoint = GET_SERVICE_PODS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{namespace}", namespace)
        .replace("{service_name}", serviceName);
      fetchPodData(podEndpoint);
    }
  }, [selectedSpan, selectedCluster, spanData]);

  const rawSpanData =
    rawSpanResponse && selectedSpan ? rawSpanResponse[selectedSpan] : null;

  const parsedSpanData = useMemo(() => {
    if (!rawSpanData) return null;
    const parsedSpanData = rawSpanData;
    if (rawSpanData.request_payload && rawSpanData.response_payload) {
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

  const { keys: TAB_KEYS, content: TAB_CONTENT } =
    spanData && parsedSpanData && selectedSpan
      ? getTabByProtocol(
          parsedSpanData.protocol,
          spanData[selectedSpan],
          parsedSpanData,
          podData ?? null,
          exceptionData
        )
      : { keys: null, content: null };
  if (!rawSpanData || !spanData || !selectedSpan || !TAB_KEYS) {
    return <TabSkeleton />;
  }

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
            } else {
              return (
                <div
                  className={cx(styles["tab-content"], styles["response-tab"])}
                  role="tabpanel"
                  hidden={activeTab !== TAB_KEYS[index].key}
                  key={nanoid()}
                >
                  {tab.list.map((obj: GenericObject) => {
                    const val = objectPath.get(
                      tab.valueObj as
                        | SpanDetail
                        | HttpRequestDetail
                        | HttpResponseDetail,
                      obj.key
                    );
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
