import {
  type INTEGRATION_APPS,
  type INTEGRATION_CATEGORIES,
} from "./constants";

export type IntegrationCategoriesType = (typeof INTEGRATION_CATEGORIES)[number];

export type IntegrationAppType = (typeof INTEGRATION_APPS)[number];

export interface IntegrationListType {
  name: IntegrationAppType;
  label: string;
  description: string;
  url: string;
  logo: string;
  category: IntegrationCategoriesType;
  integrated: boolean;
  dummy?: boolean;
  tags: IntegrationCategoriesType[];
  triggerClusterModal?: boolean;
  disableAddNew?: boolean;
  disableManage?: boolean;
  disabledText?: string;
  helperText?: string;
}
export interface PrometheusBaseType {
  alias: string;
  type: "PROMETHEUS";
  url: string;
  authentication: {
    password: string;
    username: string;
  };
  level: "ORG" | "CLUSTER";
}
export interface PrometheusListType extends PrometheusBaseType {
  id: string;
  cluster_id: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  disabled: boolean;
  metric_server: boolean;
}

export interface SlackListType {
  id: string;
  name: string;
  created_at: string;
}
