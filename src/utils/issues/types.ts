import { type HTTP_METHODS } from "utils/constants";

export interface TraceMetadataDetail {
  id: string;
  status: string;
  timestamp: string;
  latency_ns: number;
  protocol: string;
  entry_path: string;
  entry_service: string;
  incident_id: string;
  incident_root_span_time: string;
  action: (typeof HTTP_METHODS)[number];
}
