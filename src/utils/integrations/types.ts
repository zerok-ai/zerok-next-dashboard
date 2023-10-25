import {
  type INTEGRATION_APPS,
  type INTEGRATION_CATEGORIES,
} from "./constants";

export type IntegrationCategoriesType = (typeof INTEGRATION_CATEGORIES)[number];

export type IntegrationAppType = (typeof INTEGRATION_APPS)[number];

export interface IntegrationListType {
  name: IntegrationAppType;
  mandatory?: boolean;
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

export type SlackInstallType = "INSTALLED" | "PENDING" | "DISABLED";
export type SlackListType =
  | {
      status: "INSTALLED";
      slack_workspace: string;
      created_at: string | null;
      updated_at: string | null;
      org_id: string;
      user_id: string;
    }
  | {
      status: "PENDING";
      slack_workspace: string;
      created_at: string | null;
      updated_at: string | null;
      org_id: string;
      user_id: string;
    }
  | {
      status: "DISABLED";
      slack_workspace: string;
      created_at: string | null;
      updated_at: string | null;
      org_id: string;
      user_id: string;
    };
