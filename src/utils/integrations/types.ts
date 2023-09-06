import { type INTEGRATION_CATEGORIES } from "./constants";

export type IntegrationCategoriesType = (typeof INTEGRATION_CATEGORIES)[number];

export interface IntegrationListType {
  name: string;
  description: string;
  url: string;
  logo: string;
  category: IntegrationCategoriesType;
}
