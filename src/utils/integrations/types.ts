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

export interface PrometheusListType {
  host: string;
  cluster: string;
  integration_date: string;
}
