import { type HTTP_METHODS } from "utils/constants";

export interface TraceMetadataDetail {
  id: string;
  status: string;
  timestamp: string;
  latency: number;
  protocol: string;
  entry_point: string;
  action: (typeof HTTP_METHODS)[number];
}
