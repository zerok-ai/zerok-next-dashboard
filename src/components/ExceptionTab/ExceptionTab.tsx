import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clusterSelector } from "redux/cluster";
import { useSelector } from "redux/store";
import { GET_SPAN_RAWDATA_ENDPOINT } from "utils/endpoints";
import { type SpanRawData } from "utils/types";

interface ExceptionTabProps {
  exceptionSpan: string;
}

const ExceptionTab = ({ exceptionSpan }: ExceptionTabProps) => {
  const { selectedCluster } = useSelector(clusterSelector);
  const router = useRouter();
  const { issue_id, id: incidentId } = router.query;
  const { data: exceptionSpanData, fetchData } = useFetch<SpanRawData>(
    "span_raw_data_details"
  );
  useEffect(() => {
    if (exceptionSpanData && selectedCluster && incidentId) {
      const endpoint = GET_SPAN_RAWDATA_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{span_id}", exceptionSpan)
        .replace("{incident_id}", incidentId as string)
        .replace("{issue_id}", issue_id as string);
      fetchData(endpoint);
    }
  }, [exceptionSpan, incidentId, selectedCluster]);
  return <div>ExceptionTab</div>;
};

export default ExceptionTab;
