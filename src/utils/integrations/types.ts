import { type INTEGRATION_CATEGORIES } from "./constants";

export type IntegrationCategoriesType = (typeof INTEGRATION_CATEGORIES)[number];

export interface IntegrationListType {
  name: string;
  label: string;
  description: string;
  url: string;
  logo: string;
  category: IntegrationCategoriesType;
  integrated: boolean;
  tags: IntegrationCategoriesType[];
}
export interface PrometheusBaseType {
  type: "PROMETHEUS";
  url: string;
  authentication: {
    password: string;
    username: string;
  };
  level: "ORG" | "CLUSTER";
}
export interface PrometheusListType extends PrometheusBaseType {
  id: number;
  cluster_id: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  disabled: boolean;
}
