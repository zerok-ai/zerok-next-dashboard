import CustomSkeleton from "components/custom/CustomSkeleton";
import { useFetch } from "hooks/useFetch";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { memo, useEffect } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { GET_SPAN_RAWDATA_ENDPOINT } from "utils/endpoints";
import { type SpanRawDataResponse } from "utils/types";

import styles from "./ExceptionTab.module.scss";

interface ExceptionTabProps {
  spanKey: string;
  incidentId: string | null;
}

const ExceptionTab = ({ spanKey, incidentId }: ExceptionTabProps) => {
  const {
    data: exceptionSpan,
    fetchData,
    error,
  } = useFetch<SpanRawDataResponse>("span_raw_data_details", null);

  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const { issue } = router.query;

  useEffect(() => {
    if (selectedCluster && incidentId) {
      const endpoint = GET_SPAN_RAWDATA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{issue_id}", issue as string)
        .replace("{incident_id}", incidentId)
        .replace("{span_id}", spanKey);
      fetchData(endpoint);
    }
  }, [selectedCluster, incidentId]);

  if (!exceptionSpan && !error) {
    return (
      <div className={styles.container}>
        <CustomSkeleton len={5} />
      </div>
    );
  }
  const exceptionData =
    exceptionSpan && exceptionSpan[Object.keys(exceptionSpan)[0]];
  const data = exceptionData?.req_body as string;
  if (!data || error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h6>Exception</h6>
        </div>
        <div className={styles.content}>
          <div className={styles.row}>
            This feature is disabled for your organisation. Please contact ZeroK
            to know more.
          </div>
        </div>
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
