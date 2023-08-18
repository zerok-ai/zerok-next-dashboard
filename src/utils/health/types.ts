export interface ServiceMapDetail {
  responder_pod: string;
  requestor_pod: string;
  responder_service: string;
  requestor_service: string;
  responder_ip: string;
  requestor_ip: string;
  latency_p50: number;
  latency_p90: number;
  latency_p99: number;
  request_throughput: number;
  error_rate: number;
  inbound_throughput: number;
  outbound_throughput: number;
  throughput_total: number;
}
