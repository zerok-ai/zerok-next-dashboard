import CodeBlock from "components/CodeBlock";
import ChipX from "components/themeX/ChipX";
import dynamic from "next/dynamic";
import { convertNanoToMilliSeconds } from "utils/functions";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });
export const HTTP_TAB_KEYS = [
  "request_headers",
  "request_body",
  "response_headers",
  "response_body",
] as const;

interface HttpTabKey {
  label: string;
  key: string;
  render?: (val: any) => React.ReactNode;
}

export const renderJSON = (val: string) => {
  let json = null;
  try {
    json = JSON.parse(val);
  } catch (err) {
    console.log({ err });
  }
  if (json) {
    return (
      <DynamicReactJson
        src={json}
        name={false}
        displayDataTypes={false}
        enableClipboard={false}
      />
    );
  }
  if (val.length > 0) {
    return <CodeBlock code={val} allowCopy color="light" />;
  }
  return <span>{"{ }"}</span>;
};

export const HTTP_TABS: Array<{
  label: string;
  key: (typeof HTTP_TAB_KEYS)[number];
}> = [
  {
    label: "Request Headers",
    key: "request_headers",
  },
  {
    label: "Request Body",
    key: "request_body",
  },
  {
    label: "Response Headers",
    key: "response_headers",
  },
  {
    label: "Response Body",
    key: "response_body",
  },
];

export const OVERVIEW_KEYS: HttpTabKey[] = [
  {
    label: "Protocol",
    key: "protocol",
    render: (value) => <ChipX label={value} />,
  },
  { label: "Source", key: "source" },
  { label: "Destination", key: "destination" },
  {
    label: "Latency",
    key: "latency_ns",
    render: (value) => `${convertNanoToMilliSeconds(value)}`,
  },
  { label: "Status", key: "status" },
];

export const POD_KEYS: HttpTabKey[] = [
  {
    label: "Protocol",
    key: "protocol",
    render: (value) => <ChipX label={value} />,
  },
  { label: "Source", key: "source" },
  { label: "Destination", key: "destination" },
  {
    label: "Latency",
    key: "latency_ms",
    render: (value) => `${value as string} ms`,
  },
  { label: "Status", key: "status" },
];

export const HTTP_REQUEST_HEADER_KEYS = [
  {
    label: "Method",
    key: "request_payload.req_method",
    render: (val: string) => <ChipX label={val} />,
  },
  { label: "Endpoint", key: "request_payload.req_path" },
  {
    label: "Request headers",
    key: "request_payload.req_headers",
    render: (val: string) => {
      if (!val.length) {
        return <span>{"{ }"}</span>;
      }
      return renderJSON(val);
    },
  },
];

export const HTTP_REQUEST_BODY_KEYS = [
  {
    label: "Method",
    // key: "request_payload.req_method",
    key: "request_payload.req_method",
    render: (val: string) => <ChipX label={val} />,
  },
  {
    label: "Request body",
    key: "request_payload.req_body",
    render: (val: string) => {
      return renderJSON(val);
    },
  },
];

export const HTTP_RESPONSE_HEADER_KEYS = [
  {
    label: "Response headers",
    // key: "response_payload.resp_headers",
    key: "response_payload.resp_headers",
    render: (val: string) => {
      return renderJSON(val);
    },
  },
];

export const HTTP_RESPONSE_BODY_KEYS = [
  {
    label: "Response body",
    key: "response_payload.resp_body",
    render: (val: string) => {
      return renderJSON(val);
    },
  },
];
