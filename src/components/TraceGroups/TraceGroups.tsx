import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "redux/store";
import { DEFAULT_TIME_RANGE } from "utils/constants";
import { TRACE_GROUP_PAGE_SIZE } from "utils/scenarios/constants";
import { GET_TRACE_GROUPS_ENDPOINT } from "utils/scenarios/endpoints";

// import styles from "./TraceGroups.module.scss";

const TraceGroups = () => {
  const { data: traceGroups, fetchData: fetchTraceGroups } =
    useFetch("traceGroups");
  const router = useRouter();
  const range = (router.query.range as string) ?? DEFAULT_TIME_RANGE;
  const scenarioID = router.query.issue;
  const { selectedCluster } = useSelector((state) => state.cluster);

  useEffect(() => {
    if (selectedCluster && scenarioID) {
      const endpoint = GET_TRACE_GROUPS_ENDPOINT.replace(
        "{cluster_id}",
        selectedCluster
      )
        .replace("{limit}", TRACE_GROUP_PAGE_SIZE.toString())
        .replace("{range}", range)
        .replace("{offset}", "0")
        .replace("{scenario_id}", scenarioID as string);
      fetchTraceGroups(endpoint);
    }
  }, [selectedCluster]);
  console.log({ traceGroups });
  return <div>TraceGroups</div>;
};

export default TraceGroups;
