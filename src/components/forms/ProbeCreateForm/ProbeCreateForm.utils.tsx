export const PROBE_TIME_RANGES = [
  {
    label: "Forever",
    value: "forever",
  },
  {
    label: "6 hours",
    value: "-6h",
  },
  {
    label: "12 hours",
    value: "-12h",
  },
  {
    label: "24 hours",
    value: "-24h",
  },
  {
    label: "3 days",
    value: "-3d",
  },
  {
    label: "1 week",
    value: "-7d",
  },
];

export const PROPERTIES = [
  {
    label: "Service",
    value: "service",
  },
  {
    label: "Payload",
    value: "payload",
  },
  {
    label: "Span ID",
    value: "span_id",
  },
  {
    label: "Trace ID",
    value: "trace_id",
  },
  {
    label: "HTTP Status Code",
    value: "http_status_code",
  },
  {
    label: "HTTP host",
    value: "http_host",
  },
  {
    label: "HTTP method",
    value: "http_method",
  },
  {
    label: "HTTP target",
    value: "http_target",
  },
  {
    label: "DB System",
    value: "db_system",
  },
  {
    label: "DB Name",
    value: "db_name",
  },
  {
    label: "DB Statement",
    value: "db_statement",
  },
  {
    label: "DB User",
    value: "db_user",
  },
];

export const CONDITIONS = [
  {
    label: "and",
    value: "and",
  },
  {
    label: "or",
    value: "or",
  },
  {
    label: "not",
    value: "not",
  },
];

export const EQUALS = [
  {
    label: "is equal to",
    value: "equals",
  },
  {
    label: "is not equal to",
    value: "not_equals",
  },
  {
    label: "is less than",
    value: "less_than",
  },
  {
    label: "is less than or equal to",
    value: "less_than_or_equal_to",
  },
  {
    label: "is greater than",
    value: "greater_than",
  },
  {
    label: "is greater than or equal to",
    value: "greater_than_or_equal_to",
  },
  {
    label: "exists",
    value: "exists",
  },
  {
    label: "does not exist",
    value: "not_exists",
  },
  {
    label: "in",
    value: "in",
  },
  {
    label: "not in",
    value: "not_in",
  },
];

export const CUSTOM_TYPES = [
  {
    label: "Null",
    value: "null",
  },
  {
    label: "Custom",
    value: "custom",
  },
];

export interface SlackChannelType {
  type: "channel" | "person";
  value: string;
}

export const SLACK_CHANNELS: SlackChannelType[] = [
  {
    type: "channel",
    value: "zerok",
  },
  {
    type: "person",
    value: "Varun",
  },
  {
    type: "channel",
    value: "tech",
  },
  {
    type: "person",
    value: "Shivam",
  },
  {
    type: "person",
    value: "Samyukktha",
  },
  {
    type: "channel",
    value: "oncall",
  },
];
