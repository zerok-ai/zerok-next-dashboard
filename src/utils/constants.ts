import { type UserProfileType } from "redux/types";

export const TOKEN_NAME = "token";

export const DEFAULT_USER_PROFILE: UserProfileType = {
  id: "1",
  email: "kelvin.z@zerok.ai",
  name: "Kelvin Z",
  role: "UI/UX Designer",
};

export const HTTP_ERROR_CODES = {
  EXPIRED: 419,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  THROTTLED: 429,
};

// used for calculating space in js
export const SPACE_TOKEN = 4;

export const CLUSTER_STATES = {
  HEALTHY: "CS_HEALTHY",
  DEGRADED: "CS_DEGRADED",
};

export const DEFAULT_COL_WIDTH = 80;

export const IGNORED_SERVICES_PREFIXES = [
  "pl",
  "pl, pl",
  "px-operator",
  "plc",
  "zk-client",
];

export const HTTP_METHODS = ["GET", "POST", "DELETE", "PUT", "PATCH"] as const;

export const SPAN_PROTOCOLS = [
  "http",
  "mysql",
  "HTTP",
  "GRPC",
  "UNKNOWN",
] as const;

export const NODE_WIDTH = 220;

export const DEFAULT_TIME_RANGE = "-24h";

export const CLUSTER_LOCALSTORAGE_NAME = "zk-cluster";

export const HTTP_METHOD_COLORS: Record<(typeof HTTP_METHODS)[number], string> =
  {
    GET: "rgba(15, 105, 180, 0.8)",
    POST: "rgba(11, 165, 73, 0.8)",
    DELETE: "rgba(164, 30,34, 0.6)",
    PUT: "rgba(197, 134, 42, 0.6)",
    PATCH: "rgba(210, 128, 66, 0.6)",
  };

export const MYSQL_COLOR = "rgba(243, 148, 31, 0.8)";
