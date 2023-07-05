export interface ChildrenType {
  children: React.ReactNode;
}

export interface GenericObject {
  [key: string]: any;
}

export interface DrawerNavItemType {
  icon: string;
  label: string;
  path: string;
}
export interface useStatusType {
  loading: boolean;
  error: null | string;
}

export interface ApiKeyHidden {
  id: string;
  createdAtMs: number;
}

export interface ApiKeyDetail {
  id: string;
  createdAtMs: number;
  key: null | string;
}

export interface UserDetail {
  name: string;
  email: string;
  id: string;
}

export interface ServiceDetail {
  service: string;
  pod_count: number;
  http_latency_in: {
    p01: null | number;
    p10: null | number;
    p25: null | number;
    p50: null | number;
    p75: null | number;
    p90: null | number;
  };
  http_req_throughput_in: number;
  http_error_rate_in: number;
  inbound_conns: number;
  outerHeight: number;
}

// {
// 	"payload": {
// 		"issues": [
// 				{
// 						"issue_id": "",
// 						"issue_title": "Test1",
// 						"scenario_id": "1",
//             "scenario_version": "v1",

//             "velocity": 2,
//             "total_count": 2,

//             "source": "source1",
//             "destination": "destination1",
//             "first_seen": "2023-06-20T17:50:15.572639Z",
//             "last_seen": "2023-06-20T17:50:15.572639Z",
//             "incidents": [
//             	/* list of latest 5 incident_ids */
//             ]
//         }
//     ]
// }

export interface IncidentDetail {
  issue_id: string;
  issue_title: string;
  scenario_id: string;
  scenario_version: string;
  total_count: number;
  velocity: number;
  source: string;
  destination: string;
  first_seen: string;
  last_seen: string;
  incidents: string[];
}
