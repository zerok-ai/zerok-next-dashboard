import CustomSkeleton from "components/CustomSkeleton";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { memo, useEffect } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { GET_SPAN_RAWDATA_ENDPOINT } from "utils/endpoints";
import { type GenericObject, type SpanRawDataResponse } from "utils/types";

import styles from "./ExceptionTab.module.scss";

interface ExceptionTabProps {
  spanKey: string;
}

const spanTransformer = (spans: SpanRawDataResponse) => {
  const key = Object.keys(spans)[0];
  const span = spans[key];
  try {
    span.request_payload = JSON.parse(span.request_payload as string);
    span.response_payload = JSON.parse(span.response_payload as string);
  } catch (err) {
    console.log({ err });
  }
  const res: SpanRawDataResponse = {};
  res[key] = span;
  return res;
};

const ExceptionTab = ({ spanKey }: ExceptionTabProps) => {
  const { data: exceptionSpan, fetchData } = useFetch<SpanRawDataResponse>(
    "span_raw_data_details",
    null,
    spanTransformer
  );

  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const { trace, issue } = router.query;

  useEffect(() => {
    if (selectedCluster) {
      const endpoint = GET_SPAN_RAWDATA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issue as string)
        .replace("{incident_id}", trace as string)
        .replace("{span_id}", spanKey);
      fetchData(endpoint);
    }
  }, [selectedCluster]);

  if (!exceptionSpan) {
    return (
      <div className={styles.container}>
        <CustomSkeleton len={5} />
      </div>
    );
  }
  const exceptionData = exceptionSpan[Object.keys(exceptionSpan)[0]];
  const data: string = (exceptionData.request_payload as GenericObject)
    ?.req_body;
  if (!data) {
    return (
      <div className={styles.container}>
        <CustomSkeleton len={5} />
      </div>
    );
  }
  const messagePos = data.indexOf("], message=");
  const traceStr = data.substring(13, messagePos);
  const traceMsg = data.substring(messagePos + 11, data.length - 1);
  const stacktrace = traceStr.split(",");
  const splitTrace = (trace: string) => {
    const regex = /^(.*)[(](.*)(:(.*))?[)]$/;

    const traceItems = regex.exec(trace);
    if (!traceItems) {
      return {
        text: trace,
      };
    }
    return {
      text: traceItems[1],
      file: traceItems[2].split(":")[0],
      line: traceItems[2].split(":")[1],
    };
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h6>Exception</h6>
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <label className={styles.label}>Message:</label>
          <div className={styles.data}>{traceMsg}</div>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Exception:</label>
          <div className={styles["exception-rows"]}>
            {stacktrace.map((trace) => {
              const { text, file, line } = splitTrace(trace);
              return (
                <span key={nanoid()} className={styles["exception-row"]}>
                  <span>{text}</span>{" "}
                  <span className={styles["exception-helper-text"]}>
                    in file
                  </span>{" "}
                  <span>{file}</span>{" "}
                  {line && (
                    <span>
                      <span className={styles["exception-helper-text"]}>
                        at line
                      </span>{" "}
                      <span>{line}</span>
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ExceptionTab);
