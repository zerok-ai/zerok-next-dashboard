import {
  type INTEGRATION_APPS,
  type INTEGRATION_CATEGORIES,
  type INTEGRATION_DATA_SUBCATEGORIES,
} from "./constants";

export type IntegrationCategoriesType = (typeof INTEGRATION_CATEGORIES)[number];

export type IntegrationAppType = (typeof INTEGRATION_APPS)[number];

export type IntegrationDataSubcategoryType =
  (typeof INTEGRATION_DATA_SUBCATEGORIES)[number];

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
  dataSubcategory?: IntegrationDataSubcategoryType;
}
export interface PrometheusBaseType {
  alias: string;
  type: "PROMETHEUS";
  url: string;
  authentication: {
    password: string | null;
    username: string | null;
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
  metric_server?: boolean;
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

export interface OtelIntegrationListType {
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  integration_status: number;
}

export interface EBPFIntegrationListType {
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  enabled: boolean;
}

export interface IntegrationStatusResponseType {
  integration_status: {
    connection_message: string;
    connection_status: "success" | "failed";
    has_metric_server: boolean;
  };
}

export interface IntegrationUpsertResponseType
  extends IntegrationStatusResponseType {
  integration_id: string;
}
