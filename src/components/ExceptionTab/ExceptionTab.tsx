import { Skeleton } from "@mui/material";
import CodeBlock from "components/CodeBlock";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { GET_SPAN_RAWDATA_ENDPOINT } from "utils/endpoints";
import { type GenericObject, type SpanRawData } from "utils/types";

import styles from "./ExceptionTab.module.scss";

interface ExceptionTabProps {
  exceptionSpan: string;
}

const transformSpan = (span: SpanRawData) => {
  try {
    span.request_payload = JSON.parse(span.request_payload as string);
    span.response_payload = JSON.parse(span.response_payload as string);
  } catch (err) {
    console.log({ err });
  }
  return span;
};

const ExceptionTab = ({ exceptionSpan }: ExceptionTabProps) => {
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const { issue_id, id: incidentId } = router.query;
  const { data: exceptionSpanData, fetchData } = useFetch<SpanRawData>(
    `span_raw_data_details.${exceptionSpan}`,
    null,
    transformSpan
  );
  useEffect(() => {
    if (exceptionSpan && selectedCluster && incidentId) {
      const endpoint = GET_SPAN_RAWDATA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{span_id}", exceptionSpan)
        .replace("{incident_id}", incidentId as string)
        .replace("{issue_id}", issue_id as string);
      fetchData(endpoint);
    }
  }, [incidentId]);
  return exceptionSpanData ? (
    <div className={styles.container}>
      <label className={styles.label}>Exception:</label>
      <div className={styles.value}>
        <CodeBlock
          code={(exceptionSpanData.request_payload as GenericObject).req_body}
          allowCopy
          color="light"
        />
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <Skeleton variant="rectangular" className={styles.skeleton} />
    </div>
  );
};

export default ExceptionTab;
