export interface PropertyType {
  label: string;
  value: string;
  type: string;
  dynamicLabel?: boolean;
}

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

export const getPropertyOptionLabel = (
  item: PropertyType,
  selectedProperty: string | null
) => {
  if (!item.dynamicLabel) {
    return item.label;
  }
  const type = selectedProperty?.split("/")[1].includes("sql")
    ? "db"
    : "service";
  const prefix = type === "db" ? "DB" : "HTTP";
  return `${prefix} ${item.label}`;
};

export const PROPERTIES: PropertyType[] = [
  {
    label: "Latency",
    value: "latency",
    type: "double",
  },
  {
    label: "Source service",
    value: "source",
    type: "string",
  },
  {
    label: "Destination service",
    value: "destination",
    type: "string",
  },
  {
    label: "Request payload size",
    value: "request.payload_size",
    type: "int",
  },
  {
    label: "Response payload size",
    value: "response.payload_size",
    type: "int",
  },
  {
    label: "Method",
    value: "method",
    type: "string",
    dynamicLabel: true,
  },
  {
    label: "Status Code",
    value: "status",
    type: "int",
    dynamicLabel: true,
  },
  {
    label: "Route",
    value: "route",
    type: "string",
    dynamicLabel: true,
  },
  {
    label: "Query",
    value: "query",
    type: "string",
    dynamicLabel: true,
  },
  {
    label: "Status Code",
    value: "status",
    type: "int",
    dynamicLabel: true,
  },
  {
    label: "User",
    value: "user",
    type: "string",
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
